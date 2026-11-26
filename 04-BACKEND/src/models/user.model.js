const pool = require("../db/connection");


/*----Importamos bcrypt para proteger las contraseñas de los usuarios----*/
const bcrypt = require("bcrypt");


//========OBTENEMOS TODOS LOS USUARIOS=======//

const getUsers = () => {

    /*----Consultamos los usuarios y su estado sin devolver sus contraseñas----*/
    return pool.query(

        `SELECT id_usuario, nombre, email, rol, activo
         FROM usuario
         ORDER BY id_usuario`

    );

};


//========CREAR UN USUARIO=======//

const createUser = async (
    nombre,
    email,
    contrasena,
    rol,
    conexion = pool
) => {

    /*----Convertimos la contraseña en un hash antes de guardarla en la base de datos----*/
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    /*----Guardamos el nuevo usuario y devolvemos sus datos sin incluir la contraseña----*/
    return conexion.query(

        `INSERT INTO usuario (nombre, email, contrasena, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario, nombre, email, rol`,

        [nombre, email, contrasenaHash, rol]

    );

};


//======OBTENER UN USUARIO POR ID========//

const getUserById = (id_usuario) => {

    /*----Buscamos un usuario por su ID sin devolver su contraseña----*/
    return pool.query(

        `SELECT id_usuario, nombre, email, rol, activo, version_token
         FROM usuario
         WHERE id_usuario = $1`,

        [id_usuario]

    );

};


//======ACTUALIZAR UN USUARIO======//

const updateUser = async (
    id_usuario,
    nombre,
    email,
    contrasena,
    rol
) => {

    const conexion = await pool.connect();

    try {

        /*----Iniciamos una transacción----*/
        await conexion.query("BEGIN");


        /*----Protegemos la contraseña si se proporciona una nueva----*/
        let contrasenaHash = null;

        if (contrasena != null) {

            contrasenaHash = await bcrypt.hash(contrasena, 10);

        }


        /*----Actualizamos los datos de la cuenta----*/
        /*----Invalidamos las sesiones y enlaces anteriores si cambia el email o la contraseña----*/
        const resultado = await conexion.query(

            `UPDATE usuario
             SET nombre = $1,
                 email = $2::varchar,
                 contrasena = COALESCE($3, contrasena),
                 rol = $4,
                 version_token = version_token + CASE
                     WHEN email IS DISTINCT FROM $2::varchar
                     OR $3 IS NOT NULL
                     THEN 1
                     ELSE 0
                 END
             WHERE id_usuario = $5
             RETURNING id_usuario, nombre, email, rol, activo`,

            [nombre, email, contrasenaHash, rol, id_usuario]

        );


        /*----Sincronizamos el nombre del perfil del cliente----*/
        if (resultado.rowCount > 0 && rol === "cliente") {

            await conexion.query(

                `UPDATE cliente
                 SET nombre = $1
                 WHERE id_usuario = $2`,

                [nombre, id_usuario]

            );

        }


        /*----Confirmamos las operaciones----*/
        await conexion.query("COMMIT");

        return resultado;

    } catch (error) {

        /*----Deshacemos los cambios si ocurre un error----*/
        await conexion.query("ROLLBACK");

        throw error;

    } finally {

        /*----Liberamos la conexión----*/
        conexion.release();

    }

};


//======DAR DE BAJA A UN USUARIO======//

const deleteUser = async (id_usuario, bajaVoluntaria = false) => {

    const conexion = await pool.connect();

    try {

        /*----Iniciamos una transacción----*/
        await conexion.query("BEGIN");


        /*----Buscamos y bloqueamos temporalmente la cuenta----*/
        const resultadoUsuario = await conexion.query(

            `SELECT id_usuario, rol, activo
             FROM usuario
             WHERE id_usuario = $1
             FOR UPDATE`,

            [id_usuario]

        );

        const usuario = resultadoUsuario.rows[0];


        /*----Comprobamos que el usuario exista----*/
        if (!usuario) {

            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;

        }


        /*----Impedimos dar de baja a artistas y administradores----*/
        if (usuario.rol !== "cliente") {

            const error = new Error(
                "Desde este apartado solo se pueden dar de baja clientes"
            );

            error.status = 403;
            throw error;

        }


        /*----Comprobamos que la cuenta no esté ya desactivada----*/
        if (usuario.activo !== true) {

            const error = new Error(
                "El usuario ya está dado de baja"
            );

            error.status = 409;
            throw error;

        }


        /*----Comprobamos si el cliente tiene citas futuras----*/
        const resultadoCitas = await conexion.query(

            `SELECT EXISTS (
                SELECT 1
                FROM cita c
                INNER JOIN cliente cl
                    ON c.id_cliente = cl.id_cliente
                WHERE cl.id_usuario = $1
                AND c.estado IN ('pendiente', 'confirmada')
                AND (c.fecha + c.hora) >=
                    (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Madrid')
            ) AS tiene_citas`,

            [id_usuario]

        );


        /*----Gestionamos las citas futuras según el tipo de baja----*/
        if (resultadoCitas.rows[0].tiene_citas) {

            /*----Impedimos la baja administrativa si existen citas futuras----*/
            if (!bajaVoluntaria) {

                const error = new Error(
                    "No se puede dar de baja al cliente porque tiene citas futuras pendientes o confirmadas"
                );

                error.status = 409;
                throw error;

            }


            /*----Cancelamos las citas futuras si la baja es voluntaria----*/
            await conexion.query(

                `UPDATE cita
                 SET estado = 'cancelada'
                 WHERE id_cliente IN (
                     SELECT id_cliente
                     FROM cliente
                     WHERE id_usuario = $1
                 )
                 AND estado IN ('pendiente', 'confirmada')
                 AND (fecha + hora) >=
                     (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Madrid')`,

                [id_usuario]

            );

        }


        /*----Desactivamos la cuenta conservando sus datos y su historial----*/
        /*----Invalidamos las sesiones y enlaces de recuperación anteriores----*/
        const resultado = await conexion.query(

            `UPDATE usuario
             SET activo = FALSE,
                 version_token = version_token + 1
             WHERE id_usuario = $1
             AND rol = 'cliente'
             AND activo = TRUE
             RETURNING id_usuario, nombre, email, rol, activo`,

            [id_usuario]

        );


        /*----Confirmamos la operación----*/
        await conexion.query("COMMIT");

        return resultado;

    } catch (error) {

        /*----Deshacemos los cambios si ocurre algún error----*/
        await conexion.query("ROLLBACK");

        throw error;

    } finally {

        /*----Liberamos la conexión----*/
        conexion.release();

    }

};


//======BUSCAR USUARIO POR EMAIL======//

const getUserByEmail = async (email) => {

    /*----Buscamos el usuario por su correo independientemente de mayúsculas y espacios----*/
    const result = await pool.query(

        `SELECT *
         FROM usuario
         WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))`,

        [email]

    );

    return result.rows[0];

};


//=====CAMBIAR LA CONTRASEÑA DE UN USUARIO=====//

const cambiarContrasena = async (
    id_usuario,
    nuevaContrasena
) => {

    /*----Convertimos la nueva contraseña en un hash para guardarla de forma segura----*/
    const contrasenaHash = await bcrypt.hash(nuevaContrasena, 10);


    /*----Actualizamos la contraseña e invalidamos las sesiones y enlaces anteriores----*/
    const resultado = await pool.query(

        `UPDATE usuario
         SET contrasena = $1,
             version_token = version_token + 1
         WHERE id_usuario = $2
         RETURNING id_usuario, nombre, email, rol`,

        [contrasenaHash, id_usuario]

    );

    return resultado.rows[0];

};


//=======GUARDAR TOKEN DE RECUPERACIÓN=======//

const guardarTokenRecuperacion = async (
    id_usuario,
    tokenHash,
    versionToken
) => {

    /*----Guardamos el token con su versión y una caducidad de 15 minutos----*/
    return pool.query(

        `INSERT INTO recuperacion_contrasena
            (id_usuario, token_hash, fecha_expiracion, version_token)
         VALUES (
            $1,
            $2,
            CURRENT_TIMESTAMP + INTERVAL '15 minutes',
            $3
         )
         ON CONFLICT (id_usuario)
         DO UPDATE SET
            token_hash = EXCLUDED.token_hash,
            fecha_creacion = CURRENT_TIMESTAMP,
            fecha_expiracion = EXCLUDED.fecha_expiracion,
            version_token = EXCLUDED.version_token,
            utilizado = FALSE`,

        [id_usuario, tokenHash, versionToken]

    );

};


//=======RESTABLECER CONTRASEÑA=======//

const restablecerContrasena = async (
    tokenHash,
    nuevaContrasena
) => {

    /*----Protegemos la nueva contraseña mediante bcrypt----*/
    const contrasenaHash = await bcrypt.hash(nuevaContrasena, 10);

    const conexion = await pool.connect();

    try {

        /*----Iniciamos una transacción----*/
        await conexion.query("BEGIN");


        /*----Comprobamos el token y lo marcamos como utilizado----*/
        const resultadoToken = await conexion.query(

            `UPDATE recuperacion_contrasena
             SET utilizado = TRUE
             WHERE token_hash = $1
             AND utilizado = FALSE
             AND fecha_expiracion > clock_timestamp()
             RETURNING id_usuario, version_token`,

            [tokenHash]

        );


        /*----Impedimos utilizar tokens inválidos o caducados----*/
        if (resultadoToken.rowCount === 0) {

            const error = new Error(
                "El enlace de recuperación no es válido o ha caducado"
            );

            error.status = 400;
            throw error;

        }


        /*----Recuperamos el ID del usuario y la versión del token----*/
        const id_usuario = resultadoToken.rows[0].id_usuario;

        const versionToken = resultadoToken.rows[0].version_token;


        /*----Actualizamos la contraseña únicamente si la cuenta está activa----*/
        /*----Comprobamos que la versión del enlace siga siendo válida----*/
        /*----Invalidamos todas las sesiones anteriores al cambio de contraseña----*/
        const resultadoUsuario = await conexion.query(

            `UPDATE usuario
             SET contrasena = $1,
                 version_token = version_token + 1
             WHERE id_usuario = $2
             AND version_token = $3
             AND activo = TRUE
             AND (
                 rol <> 'artista'
                 OR EXISTS (
                     SELECT 1
                     FROM artista
                     WHERE artista.id_usuario = usuario.id_usuario
                     AND artista.activo = TRUE
                 )
             )
             RETURNING id_usuario, nombre, email, rol`,

            [contrasenaHash, id_usuario, versionToken]

        );


        /*----Impedimos recuperar cuentas desactivadas o utilizar enlaces antiguos----*/
        if (resultadoUsuario.rowCount === 0) {

            const error = new Error(
                "El enlace de recuperación ya no es válido"
            );

            error.status = 400;
            throw error;

        }


        /*----Confirmamos ambas operaciones----*/
        await conexion.query("COMMIT");

        return resultadoUsuario.rows[0];

    } catch (error) {

        /*----Deshacemos los cambios si ocurre algún error----*/
        await conexion.query("ROLLBACK");

        throw error;

    } finally {

        /*----Liberamos la conexión----*/
        conexion.release();

    }

};


//=======REGISTRAR UN CLIENTE=======//

const registrarCliente = async ({
    nombre,
    apellidos,
    email,
    contrasena,
    telefono,
    direccion
}) => {

    const client = await pool.connect();

    try {

        /*----Iniciamos una transacción----*/
        await client.query("BEGIN");


        /*----Protegemos la contraseña mediante bcrypt----*/
        const contrasenaHash = await bcrypt.hash(contrasena, 10);


        /*----Creamos el usuario con el rol cliente----*/
        const resultadoUsuario = await client.query(

            `INSERT INTO usuario (nombre, email, contrasena, rol)
             VALUES ($1, $2, $3, 'cliente')
             RETURNING id_usuario, nombre, email, rol`,

            [nombre, email, contrasenaHash]

        );

        const usuario = resultadoUsuario.rows[0];


        /*----Creamos el perfil de cliente asociado----*/
        await client.query(

            `INSERT INTO cliente
             (nombre, apellidos, telefono, direccion, id_usuario)
             VALUES ($1, $2, $3, $4, $5)`,

            [
                nombre,
                apellidos,
                telefono || null,
                direccion || null,
                usuario.id_usuario
            ]

        );


        /*----Confirmamos ambas operaciones----*/
        await client.query("COMMIT");

        return usuario;

    } catch (error) {

        /*----Deshacemos los cambios si ocurre un error----*/
        await client.query("ROLLBACK");

        throw error;

    } finally {

        /*----Liberamos la conexión----*/
        client.release();

    }

};


//=======EXPORTAMOS LAS FUNCIONES======//

module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    cambiarContrasena,
    guardarTokenRecuperacion,
    restablecerContrasena,
    registrarCliente

};