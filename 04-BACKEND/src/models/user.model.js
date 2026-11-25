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

        `SELECT id_usuario, nombre, email, rol, activo
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
        const resultado = await conexion.query(

            `UPDATE usuario
             SET nombre = $1,
                 email = $2,
                 contrasena = COALESCE($3, contrasena),
                 rol = $4
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

const deleteUser = async (id_usuario) => {

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


        /*----Impedimos la baja si existen citas futuras pendientes o confirmadas----*/
        if (resultadoCitas.rows[0].tiene_citas) {

            const error = new Error(
                "No se puede dar de baja al cliente porque tiene citas futuras pendientes o confirmadas"
            );

            error.status = 409;
            throw error;

        }


        /*----Desactivamos la cuenta conservando sus datos y su historial----*/
        const resultado = await conexion.query(

            `UPDATE usuario
             SET activo = FALSE
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

    /*----Buscamos el usuario por su correo para comprobar sus datos durante el inicio de sesión----*/
    const result = await pool.query(

        'SELECT * FROM usuario WHERE email = $1',

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

    /*----Actualizamos únicamente la contraseña del usuario indicado----*/
    const resultado = await pool.query(

        `UPDATE usuario
         SET contrasena = $1
         WHERE id_usuario = $2
         RETURNING id_usuario, nombre, email, rol`,

        [contrasenaHash, id_usuario]

    );

    return resultado.rows[0];

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
    registrarCliente

};