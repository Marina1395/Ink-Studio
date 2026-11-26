


const usuarioModel = require("../models/user.model");

/*----Importamos el modelo de artistas para comprobar su estado----*/
const artistaModel = require("../models/artista.model");


/*----Importamos bcrypt para comprobar las contraseñas durante el login----*/
const bcrypt = require("bcrypt");



/*----Importamos jsonwebtoken para generar los tokens de autenticación----*/
const jwt = require("jsonwebtoken");


/*----Importamos crypto para generar y proteger los tokens de recuperación----*/
const crypto = require("node:crypto");

/*----Importamos el servicio de correo electrónico----*/
const { enviarCorreoRecuperacion } = require("../services/email.service");



//=======OBTENER TODOS LOS USUARIOS=======//


const getUsers = async (req, res) => {

    try {


        /*----Obtenemos todos los usuarios registrados desde el modelo----*/
        const resultado = await usuarioModel.getUsers();

        /*----Devolvemos los usuarios encontrados en formato JSON----*/
        res.json(resultado.rows);

    } catch (error) {


        console.error(error);


        /*----Devolvemos un error si no podemos obtener los usuarios----*/
        res.status(500).json({


            error: "Error al obtener los usuarios"

        });

    }

};




//======= CREAR USUARIO=======//


const createUser = async (req, res) => {

    try {


        const {
            nombre,
            apellidos,
            email,
            contrasena,
            telefono,
            direccion

        } = req.body;





        if (!nombre || !apellidos || !email || !contrasena || !telefono) {

            return res.status(400).json({
                error: "Nombre, apellidos, email, contraseña y teléfono son obligatorios"
            });



        }




        /*----Comprobamos que los datos recibidos sean textos----*/

        if (

            typeof nombre !== "string" ||
            typeof apellidos !== "string" ||
            typeof email !== "string" ||
            typeof contrasena !== "string" ||
            typeof telefono !== "string" ||
            (direccion != null && typeof direccion !== "string")

        ) {
            return res.status(400).json({

                error: "Los datos del registro deben ser textos"

            });

        }



        /*----Validamos los apellidos del cliente----*/

        const apellidosLimpios = apellidos.trim();

        if (apellidosLimpios.length < 2 || apellidosLimpios.length > 100) {

            return res.status(400).json({

                error: "Los apellidos deben tener entre 2 y 100 caracteres"

            });
        }



        /*----Validamos el teléfono del cliente----*/

        const telefonoLimpio = telefono.trim();

        if (!/^\+?[0-9\s-]{9,20}$/.test(telefonoLimpio)) {

            return res.status(400).json({

                error: "Introduce un número de teléfono válido"

            });
        }



        /*----Comprobamos que el nombre tenga entre 2 y 100 caracteres----*/
        const nombreLimpio = nombre.trim();

        if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {

            return res.status(400).json({

                error: "El nombre debe tener entre 2 y 100 caracteres"
            });
        }




        /*----Comprobamos que la contraseña tenga entre 8 y 72 caracteres----*/
        if (contrasena.length < 8 || contrasena.length > 72) {

            return res.status(400).json({


                error: "La contraseña debe tener entre 8 y 72 caracteres"

            });

        }



        /*----Normalizamos el correo electrónico----*/
        const emailLimpio = email.trim().toLowerCase();



        /*----Comprobamos que el email tenga un formato válido----*/
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(emailLimpio)) {

            return res.status(400).json({

                error: "El email no tiene un formato válido"

            });

        }


        /*----Comprobamos si ya existe un usuario registrado con ese correo electrónico----*/
        const usuarioExistente = await usuarioModel.getUserByEmail(emailLimpio);

        if (usuarioExistente) {


            return res.status(409).json({

                error: "Ya existe un usuario registrado con ese email"

            });

        }




        /*----Registramos el usuario y su perfil de cliente en una transacción----*/

        const usuarioRegistrado = await usuarioModel.registrarCliente({

            nombre: nombreLimpio,
            apellidos: apellidosLimpios,
            email: emailLimpio,
            contrasena,
            telefono: telefonoLimpio,
            direccion: direccion?.trim() || null

        });



        /*----Confirmamos que la cuenta se ha creado correctamente----*/
        return res.status(201).json({

            mensaje: "Cuenta de cliente creada correctamente",
            usuario: usuarioRegistrado

        });



    } catch (error) {

        console.error("Error al registrar el cliente:", error);




        /*----Controlamos los registros duplicados----*/

        if (error.code === "23505") {

            return res.status(409).json({

                error: "Ya existe una cuenta con esos datos"

            });
        }



        /*----Controlamos los errores inesperados----*/
        return res.status(500).json({

            error: "Error interno al registrar el cliente"

        });

    }

};




//======OBTENER UN USUARIO POR ID ======

const getUserById = async (req, res) => {

    try {

        /*----Recogemos el ID del usuario que viene en la URL----*/
        const { id_usuario } = req.params;

        /*----Buscamos el usuario correspondiente a ese ID desde el modelo----*/
        const resultado = await usuarioModel.getUserById(id_usuario);

        /*----Comprobamos si el usuario existe en la base de datos----*/
        if (!resultado.rows[0]) {

            return res.status(404).json({

                error: "Usuario no encontrado"

            });
        }

        /*----Devolvemos los datos del usuario encontrado----*/
        return res.status(200).json(resultado.rows[0]);


    } catch (error) {


        console.error(error);

        /*----Devolvemos un error si no podemos obtener el usuario----*/
        res.status(500).json({

            error: "Error al obtener el usuario"

        });
    }
};




//=======ACTUALIZAR USUARIO=======//

const updateUser = async (req, res) => {

    try {

        /*----Recogemos el ID y los datos del usuario----*/
        const { id_usuario } = req.params;
        const { nombre, email, contrasena, rol } = req.body;


        /*----Comprobamos que el usuario haya iniciado sesión----*/
        if (!req.usuario) {

            return res.status(401).json({
                error: "Debes iniciar sesión"
            });

        }


        /*----Comprobamos los permisos del usuario----*/
        if (
            req.usuario.rol !== "admin" &&
            String(req.usuario.id_usuario) !== String(id_usuario)
        ) {

            return res.status(403).json({
                error: "No tienes permiso para modificar este usuario"
            });

        }


        /*----Validamos el nombre y el correo electrónico----*/
        if (
            typeof nombre !== "string" ||
            typeof email !== "string" ||
            nombre.trim().length < 2 ||
            nombre.trim().length > 100
        ) {

            return res.status(400).json({
                error: "Los datos del usuario no son válidos"
            });

        }


        /*----Normalizamos y validamos el correo electrónico----*/
        const emailLimpio = email.trim().toLowerCase();

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(emailLimpio)) {

            return res.status(400).json({
                error: "El email no tiene un formato válido"
            });

        }


        /*----Validamos la contraseña únicamente si se proporciona----*/
        if (
            contrasena != null &&
            (
                typeof contrasena !== "string" ||
                contrasena.length < 8 ||
                contrasena.length > 72
            )
        ) {

            return res.status(400).json({
                error: "La contraseña debe tener entre 8 y 72 caracteres"
            });

        }


        /*----Comprobamos que el usuario exista----*/
        const usuarioActual = await usuarioModel.getUserById(id_usuario);

        if (!usuarioActual.rows[0]) {

            return res.status(404).json({
                error: "Usuario no encontrado"
            });

        }


        /*----Conservamos el rol actual del usuario----*/
        const rolActual = usuarioActual.rows[0].rol;

        if (rol !== undefined && rol !== rolActual) {

            return res.status(403).json({
                error: "No se permite cambiar el rol desde esta operación"
            });

        }


        /*----Comprobamos que el email no pertenezca a otra cuenta----*/
        const usuarioExistente = await usuarioModel.getUserByEmail(emailLimpio);

        if (
            usuarioExistente &&
            String(usuarioExistente.id_usuario) !== String(id_usuario)
        ) {

            return res.status(409).json({
                error: "El email ya está registrado por otro usuario"
            });

        }


        /*----Actualizamos los datos del usuario----*/
        const resultado = await usuarioModel.updateUser(
            id_usuario,
            nombre.trim(),
            emailLimpio,
            contrasena ?? null,
            rolActual
        );


        /*----Comprobamos que se haya actualizado el usuario----*/
        if (resultado.rowCount === 0) {

            return res.status(404).json({
                error: "Usuario no encontrado"
            });

        }


        /*----Devolvemos los datos actualizados----*/
        return res.status(200).json(resultado.rows[0]);


    } catch (error) {

        console.error(error);

        /*----Controlamos los correos duplicados----*/
        if (error.code === "23505") {

            return res.status(409).json({
                error: "El email ya está registrado"
            });

        }

        return res.status(500).json({
            error: "Error al actualizar el usuario"
        });

    }

};

//=======DAR DE BAJA A UN USUARIO=======//

const deleteUser = async (req, res) => {

    try {

        /*----Recogemos el ID del usuario indicado en la URL----*/
        const id_usuario = Number(req.params.id_usuario);


        /*----Comprobamos que el usuario haya iniciado sesión----*/
        if (!req.usuario) {

            return res.status(401).json({
                error: "Debes iniciar sesión"
            });

        }


        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isSafeInteger(id_usuario) || id_usuario <= 0) {

            return res.status(400).json({
                error: "ID de usuario no válido"
            });

        }


        /*----Comprobamos si el usuario es administrador----*/
        const esAdmin = req.usuario.rol === "admin";


        /*----Comprobamos si el cliente solicita la baja de su propia cuenta----*/
        const esClientePropietario =
            req.usuario.rol === "cliente" &&
            Number(req.usuario.id_usuario) === id_usuario;


        /*----Impedimos dar de baja cuentas sin los permisos correspondientes----*/
        if (!esAdmin && !esClientePropietario) {

            return res.status(403).json({
                error: "No tienes permiso para dar de baja esta cuenta"
            });

        }


        /*----Enviamos el ID y el tipo de baja al modelo----*/
        const resultado = await usuarioModel.deleteUser(
            id_usuario,
            esClientePropietario
        );


        /*----Comprobamos que se haya actualizado la cuenta----*/
        if (resultado.rowCount === 0) {

            return res.status(409).json({
                error: "No se ha podido dar de baja al usuario"
            });

        }


        /*----Confirmamos la baja y devolvemos los datos actualizados----*/
        return res.status(200).json({

            mensaje: "Usuario dado de baja correctamente",

            usuario: resultado.rows[0]

        });

    } catch (error) {

        /*----Gestionamos los errores controlados desde el modelo----*/
        if ([403, 404, 409].includes(error.status)) {

            return res.status(error.status).json({
                error: error.message
            });

        }


        /*----Gestionamos los errores inesperados----*/
        console.error("Error al dar de baja al usuario:", error);

        return res.status(500).json({
            error: "Error interno al dar de baja al usuario"
        });

    }

};

//=======LOGIN DE USUARIO=======//

const loginUser = async (req, res) => {

    try {

        /*----Recogemos el email y la contraseña enviados por el usuario----*/
        const { email, contrasena } = req.body;

        /*----Comprobamos que no falte ningún campo obligatorio----*/
        if (!email || !contrasena) {

            return res.status(400).json({
                error: "Email y contraseña son obligatorios"
            });

        }

        /*----Comprobamos que el email y la contraseña sean textos----*/
        if (typeof email !== "string" || typeof contrasena !== "string") {

            return res.status(400).json({
                error: "Email y contraseña deben ser textos"
            });

        }

        /*----Buscamos al usuario en la base de datos mediante su email----*/
        const usuario = await usuarioModel.getUserByEmail(email);

        /*----Comprobamos si existe un usuario con ese correo----*/
        if (!usuario) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }

        /*----Comparamos la contraseña recibida con el hash guardado----*/
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        /*----Comprobamos si la contraseña es incorrecta----*/
        if (!contrasenaCorrecta) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }


        /*----Impedimos iniciar sesión a los usuarios desactivados----*/
        if (usuario.activo !== true) {

            return res.status(403).json({
                error: "Tu cuenta está desactivada"
            });

        }


        /*----Comprobamos que los artistas no estén dados de baja----*/
        if (usuario.rol === "artista") {

            const artista = await artistaModel.getArtistaById(
                usuario.id_usuario
            );

            /*----Impedimos iniciar sesión si el artista no está activo----*/
            if (!artista || artista.activo !== true) {

                return res.status(403).json({
                    error: "Tu cuenta de artista está desactivada"
                });

            }

        }


        const token = jwt.sign(

            {
                id_usuario: usuario.id_usuario,
                rol: usuario.rol,
                version_token: usuario.version_token
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );

        /*----Devolvemos el token y los datos del usuario sin incluir su contraseña----*/
        return res.status(200).json({

            mensaje: "Login correcto",

            token: token,

            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }

        });


    } catch (error) {

        console.error(error);

        /*----Devolvemos un error si no podemos iniciar sesión----*/
        return res.status(500).json({

            error: "Error al iniciar sesión"

        });

    }

};


//=======RESTABLECER CONTRASEÑA=======//

const restablecerContrasena = async (req, res) => {

    try {

        /*----Recogemos el token y las nuevas contraseñas----*/
        const {
            token,
            nuevaContrasena,
            confirmarContrasena
        } = req.body || {};


        /*----Comprobamos que el token tenga un formato válido----*/
        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/.test(token)
        ) {

            return res.status(400).json({
                error: "El enlace de recuperación no es válido"
            });

        }


        /*----Validamos la nueva contraseña----*/
        if (
            typeof nuevaContrasena !== "string" ||
            nuevaContrasena.length < 8 ||
            Buffer.byteLength(nuevaContrasena, "utf8") > 72
        ) {

            return res.status(400).json({
                error: "La contraseña debe tener al menos 8 caracteres y no superar los 72 bytes"
            });

        }


        /*----Comprobamos que ambas contraseñas coincidan----*/
        if (nuevaContrasena !== confirmarContrasena) {

            return res.status(400).json({
                error: "Las contraseñas no coinciden"
            });

        }


        /*----Generamos el hash del token recibido----*/
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


        /*----Restablecemos la contraseña e invalidamos el token----*/
        await usuarioModel.restablecerContrasena(
            tokenHash,
            nuevaContrasena
        );


        /*----Confirmamos el restablecimiento de la contraseña----*/
        return res.status(200).json({

            mensaje: "Contraseña restablecida correctamente"

        });

    } catch (error) {

        /*----Gestionamos los errores controlados desde el modelo----*/
        if (error.status === 400) {

            return res.status(400).json({
                error: error.message
            });

        }


        /*----Gestionamos los errores inesperados----*/
        console.error("Error al restablecer la contraseña:", error);

        return res.status(500).json({
            error: "Error interno al restablecer la contraseña"
        });

    }

};



//=======SOLICITAR RECUPERACIÓN DE CONTRASEÑA=======//

const solicitarRecuperacionContrasena = async (req, res) => {

    try {

        /*----Recogemos el correo electrónico del usuario----*/
        const { email } = req.body || {};


        /*----Comprobamos que el correo sea un texto válido----*/
        if (typeof email !== "string") {

            return res.status(400).json({
                error: "Debes introducir un correo electrónico"
            });

        }


        /*----Normalizamos y validamos el correo electrónico----*/
        const emailLimpio = email.trim().toLowerCase();

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(emailLimpio)) {

            return res.status(400).json({
                error: "El email no tiene un formato válido"
            });

        }


        /*----Preparamos una respuesta genérica por seguridad----*/
        const mensaje = "Si existe una cuenta activa asociada a ese correo, recibirás un enlace de recuperación";


        /*----Buscamos al usuario mediante su correo electrónico----*/
        const usuario = await usuarioModel.getUserByEmail(emailLimpio);


        /*----Impedimos recuperar cuentas inexistentes o desactivadas----*/
        if (!usuario || usuario.activo !== true) {

            return res.status(200).json({ mensaje });

        }


        /*----Comprobamos el estado de las cuentas de artistas----*/
        if (usuario.rol === "artista") {

            const artista = await artistaModel.getArtistaById(
                usuario.id_usuario
            );

            if (!artista || artista.activo !== true) {

                return res.status(200).json({ mensaje });

            }

        }


        /*----Generamos un token aleatorio de recuperación----*/
        const token = crypto.randomBytes(32).toString("hex");


        /*----Generamos el hash del token mediante SHA-256----*/
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


        /*----Guardamos el hash del token y la versión de la cuenta----*/
        await usuarioModel.guardarTokenRecuperacion(

            usuario.id_usuario,
            tokenHash,
            usuario.version_token

        );

        /*----Enviamos el enlace de recuperación al usuario----*/
        await enviarCorreoRecuperacion(emailLimpio, token);


        return res.status(200).json({ mensaje });

    } catch (error) {

        console.error("Error al solicitar la recuperación:", error);

        return res.status(500).json({
            error: "Error interno al solicitar la recuperación"
        });

    }

};

//======EXPORTAMOS FUNCIONES=======//

module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    solicitarRecuperacionContrasena,
    restablecerContrasena

};
