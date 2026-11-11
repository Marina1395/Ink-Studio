
/*----Importamos el modelo de artistas----*/
const artistaModel = require("../models/artista.model");

/*----Importamos el modelo de usuarios----*/
const usuarioModel = require("../models/user.model");


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
        if (!resultado) {

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

/*----Registramos un usuario con rol de artista y creamos su perfil profesional----*/
const createArtista = async (req, res) => {

    try {

        /*----Recogemos los datos necesarios para registrar al artista----*/
        const { nombre, email, contrasena, especialidad, descripcion } = req.body;

        /*----Comprobamos que los campos obligatorios sean textos válidos----*/
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

        /*----Comprobamos que la contraseña tenga entre 8 y 72 caracteres----*/
        if (contrasena.length < 8 || contrasena.length > 72) {

            return res.status(400).json({
                error: "La contraseña debe tener entre 8 y 72 caracteres"
            });

        }

        /*----Comprobamos que el email tenga un formato válido----*/
        const emailLimpio = email.trim().toLowerCase();
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(emailLimpio)) {

            return res.status(400).json({
                error: "El formato del email no es válido"
            });

        }

        /*----Comprobamos que la descripción sea un texto si se proporciona----*/
        if (descripcion !== undefined && typeof descripcion !== "string") {

            return res.status(400).json({
                error: "La descripción debe ser un texto"
            });

        }

        /*----Comprobamos que no exista otro usuario con el mismo email----*/
        const usuarioExistente = await usuarioModel.getUserByEmail(emailLimpio);

        if (usuarioExistente) {

            return res.status(409).json({
                error: "Ya existe un usuario con ese email"
            });

        }

        /*----Creamos la cuenta del usuario con el rol de artista----*/
        /*----La contraseña se cifra mediante bcrypt en el modelo de usuarios----*/
        const nuevoUsuario = await usuarioModel.createUser(
            nombre.trim(),
            emailLimpio,
            contrasena,
            "artista"
        );

        /*----Obtenemos el ID del nuevo usuario----*/
        const id_usuario = nuevoUsuario.rows[0].id_usuario;

        /*----Creamos el perfil profesional asociado a su cuenta----*/
        const nuevoArtista = await artistaModel.createArtista(
            id_usuario,
            especialidad.trim(),
            descripcion ? descripcion.trim() : ""
        );

        /*----Devolvemos los datos del usuario y su perfil sin incluir la contraseña----*/
        return res.status(201).json({
            mensaje: "Artista registrado correctamente",
            usuario: nuevoUsuario.rows[0],
            artista: nuevoArtista
        });

    } catch (error) {

        console.error("Error al registrar el artista:", error);

        if (error.code === "23505") {

            return res.status(409).json({
                error: "Ya existe un registro con esos datos"
            });

        }

        if (error.code === "23503") {

            return res.status(400).json({
                error: "No existe el usuario relacionado"
            });

        }

        return res.status(500).json({
            error: "Error al registrar el artista"
        });

    }

};


//=======ACTUALIZAR ARTISTA=======//

/*----Actualizamos la especialidad y la descripción de un artista----*/
const updateArtista = async (req, res) => {

    try {

        const id_usuario = Number(req.params.id_usuario);
        const { especialidad, descripcion } = req.body;

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
        const resultado = await artistaModel.updateArtista(id_usuario, artista);

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


//=======ELIMINAR ARTISTA=======//

/*----Eliminamos el perfil profesional de un artista----*/
const deleteArtista = async (req, res) => {

    try {

        const id_usuario = Number(req.params.id_usuario);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        /*----Eliminamos el perfil del artista desde el modelo----*/
        const resultado = await artistaModel.deleteArtista(id_usuario);

        /*----Comprobamos que el artista exista----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Artista no encontrado"
            });

        }

        return res.status(200).json({
            mensaje: "Perfil de artista eliminado correctamente",
            artista: resultado
        });

    } catch (error) {

        console.error("Error al eliminar el artista:", error);

        /*----Comprobamos si existen registros relacionados que impiden eliminarlo----*/
        if (error.code === "23503") {

            return res.status(409).json({
                error: "No se puede eliminar el artista porque tiene registros relacionados"
            });

        }

        return res.status(500).json({
            error: "Error al eliminar el artista"
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

        if (!artista) {

            return res.status(404).json({
                error: "Artista no encontrado"
            });

        }

        /*----Consultamos los servicios asociados al artista----*/
        const servicios = await artistaModel.getServiciosByArtista(id_usuario);

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
