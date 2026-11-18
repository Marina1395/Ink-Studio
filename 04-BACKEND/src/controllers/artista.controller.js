
/*----Importamos el modelo de artistas----*/
const artistaModel = require("../models/artista.model");

/*----Importamos el modelo de usuarios----*/
const usuarioModel = require("../models/user.model");

/*----Importamos la conexión para gestionar transacciones----*/
const pool = require("../db/connection");



//=======OBTENER TODOS LOS ARTISTAS=======//

/*----Obtenemos todos los artistas registrados en la base de datos----*/
const getArtistas = async (req, res) => {

    try {

        const resultado = await artistaModel.getArtistas();

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al obtener los artistas:", error);

        return res.status(500).json({
            error: "Error al obtener los artistas"
        });

    }

};



//=======OBTENER ARTISTA POR ID=======//

/*----Buscamos un artista utilizando su ID de usuario----*/
const getArtistaById = async (req, res) => {

    try {

        const id_usuario = Number(req.params.id_usuario);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        const resultado = await artistaModel.getArtistaById(id_usuario);

        /*----Comprobamos que el artista exista----*/
        if (!resultado || resultado.activo === false){

            return res.status(404).json({
                error: "Artista no encontrado"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al obtener el artista:", error);

        return res.status(500).json({
            error: "Error al obtener el artista"
        });

    }

};



//=======CREAR ARTISTA=======//

/*----Registramos una cuenta nueva de artista y su perfil profesional----*/
const createArtista = async (req, res) => {

    let conexionBD;
    let transaccionIniciada = false;

    try {

        /*----Recogemos los datos del nuevo artista----*/
        const {
            nombre,
            email,
            contrasena,
            especialidad,
            descripcion
        } = req.body || {};

        /*----Comprobamos los campos obligatorios----*/
        if (
            typeof nombre !== "string" ||
            typeof email !== "string" ||
            typeof contrasena !== "string" ||
            typeof especialidad !== "string" ||
            nombre.trim() === "" ||
            email.trim() === "" ||
            especialidad.trim() === ""
        ) {

            return res.status(400).json({
                error: "Nombre, email, contraseña y especialidad son obligatorios"
            });

        }

        /*----Comprobamos la longitud de la contraseña----*/
        if (contrasena.length < 8 || contrasena.length > 72) {

            return res.status(400).json({
                error: "La contraseña debe tener entre 8 y 72 caracteres"
            });

        }

        /*----Validamos el email----*/
        const emailLimpio = email.trim().toLowerCase();
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(emailLimpio)) {

            return res.status(400).json({
                error: "El formato del email no es válido"
            });

        }

        /*----Validamos la descripción si se proporciona----*/
        if (
            descripcion !== undefined &&
            typeof descripcion !== "string"
        ) {

            return res.status(400).json({
                error: "La descripción debe ser un texto"
            });

        }

        /*----Comprobamos que el email no esté registrado----*/
        const usuarioExistente = await usuarioModel.getUserByEmail(
            emailLimpio
        );

        if (usuarioExistente) {

            return res.status(409).json({
                error: "Ya existe un usuario con ese email"
            });

        }

        /*----Abrimos una conexión con PostgreSQL----*/
        conexionBD = await pool.connect();

        /*----Iniciamos la transacción----*/
        await conexionBD.query("BEGIN");
        transaccionIniciada = true;

        /*----Creamos la cuenta nueva con rol artista----*/
        const nuevoUsuario = await usuarioModel.createUser(
            nombre.trim(),
            emailLimpio,
            contrasena,
            "artista",
            conexionBD
        );

        /*----Obtenemos el ID del usuario creado----*/
        const id_usuario = nuevoUsuario.rows[0].id_usuario;

        /*----Creamos el perfil profesional asociado----*/
        const nuevoArtista = await artistaModel.createArtista(
            id_usuario,
            especialidad.trim(),
            descripcion ? descripcion.trim() : "",
            conexionBD
        );

        /*----Confirmamos ambas operaciones----*/
        await conexionBD.query("COMMIT");
        transaccionIniciada = false;

        /*----Devolvemos los datos del artista registrado----*/
        return res.status(201).json({
            mensaje: "Artista registrado correctamente",
            usuario: nuevoUsuario.rows[0],
            artista: nuevoArtista
        });

    } catch (error) {

        /*----Deshacemos los cambios si falla la transacción----*/
        if (conexionBD && transaccionIniciada) {

            try {

                await conexionBD.query("ROLLBACK");

            } catch (errorRollback) {

                console.error(
                    "Error al deshacer la transacción:",
                    errorRollback
                );

            }

        }

        console.error("Error al registrar el artista:", error);

        /*----Comprobamos si existe un registro duplicado----*/
        if (error.code === "23505") {

            return res.status(409).json({
                error: "Ya existe un registro con esos datos"
            });

        }

        /*----Comprobamos si falta un registro relacionado----*/
        if (error.code === "23503") {

            return res.status(400).json({
                error: "No existe el usuario relacionado"
            });

        }

        return res.status(500).json({
            error: "Error al registrar el artista"
        });

    } finally {

        /*----Liberamos la conexión al terminar----*/
        if (conexionBD) {
            conexionBD.release();
        }

    }

};



//=======ACTUALIZAR ARTISTA=======//

/*----Actualizamos la especialidad y la descripción de un artista----*/
const updateArtista = async (req, res) => {

    try {

        const id_usuario = Number(req.params.id_usuario);
        const { especialidad, descripcion } = req.body || {};

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        /*----Comprobamos que los datos sean correctos----*/
        if (
            typeof especialidad !== "string" ||
            especialidad.trim() === "" ||
            typeof descripcion !== "string"
        ) {

            return res.status(400).json({
                error: "La especialidad y la descripción deben ser textos válidos"
            });

        }

        /*----Agrupamos los datos que queremos actualizar----*/
        const artista = {
            especialidad: especialidad.trim(),
            descripcion: descripcion.trim()
        };

        /*----Actualizamos el perfil profesional----*/
        const resultado = await artistaModel.updateArtista(
            id_usuario,
            artista
        );

        /*----Comprobamos que el artista exista----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Artista no encontrado"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al actualizar el artista:", error);

        return res.status(500).json({
            error: "Error al actualizar el artista"
        });

    }

};



//=======DAR DE BAJA A UN ARTISTA=======//

/*----Damos de baja al artista sin eliminar su historial----*/
const deleteArtista = async (req, res) => {

    try {

        const id_usuario = Number(req.params.id_usuario);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        /*----Comprobamos que el artista exista----*/
        const artista = await artistaModel.getArtistaById(id_usuario);

        if (!artista) {

            return res.status(404).json({
                error: "Artista no encontrado"
            });

        }

        /*----Comprobamos que no esté dado de baja previamente----*/
        if (artista.activo === false) {

            return res.status(409).json({
                error: "Este artista ya está dado de baja"
            });

        }

        /*----Marcamos al artista como inactivo----*/
        const resultado = await artistaModel.deleteArtista(id_usuario);

        if (!resultado) {

            return res.status(409).json({
                error: "No se ha podido dar de baja al artista"
            });

        }

        /*----Confirmamos la baja sin eliminar sus datos históricos----*/
        return res.status(200).json({
            mensaje: "Artista dado de baja correctamente",
            artista: resultado
        });

    } catch (error) {

        console.error("Error al dar de baja al artista:", error);

        return res.status(500).json({
            error: "Error al dar de baja al artista"
        });

    }

};






 //=======OBTENER SERVICIOS DE UN ARTISTA=======//

/*----Obtenemos los servicios que ofrece un artista determinado----*/
const getServiciosByArtista = async (req, res) => {

    try {

        /*----Recogemos el ID del artista desde la URL----*/
        const id_usuario = Number(req.params.id_usuario);

        /*----Comprobamos que el identificador sea válido----*/
        if (!Number.isSafeInteger(id_usuario) || id_usuario <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        /*----Comprobamos que el artista exista----*/
        const artista = await artistaModel.getArtistaById(id_usuario);

        /*----Comprobamos que el artista exista y esté activo----*/
        if (!artista || artista.activo === false) {

            return res.status(404).json({
                error: "Artista no encontrado"
            });

        }

        /*----Consultamos los servicios asociados al artista----*/
        const servicios = await artistaModel.getServiciosByArtista(
            id_usuario
        );

        /*----Devolvemos los servicios encontrados----*/
        return res.status(200).json(servicios);

    } catch (error) {

        console.error("Error al obtener los servicios del artista:", error);

        return res.status(500).json({
            error: "Error al obtener los servicios del artista"
        });

    }

};




//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en las rutas de artistas----*/
module.exports = {
    getArtistas,
    getArtistaById,
    createArtista,
    updateArtista,
    deleteArtista,
    getServiciosByArtista
};
