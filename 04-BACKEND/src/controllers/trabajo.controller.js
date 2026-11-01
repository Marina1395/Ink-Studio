
/*----Importamos el modelo de trabajos----*/
const trabajoModel = require("../models/trabajo.model");


//=======OBTENER TODOS LOS TRABAJOS=======//

/*----Obtenemos todos los trabajos registrados en la base de datos----*/
const getTrabajos = async (req, res) => {

    try {

        const resultado = await trabajoModel.getTrabajos();

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al obtener los trabajos:", error);

        return res.status(500).json({
            error: "Error al obtener los trabajos"
        });

    }

};


//=======OBTENER TRABAJO POR ID=======//

/*----Buscamos un trabajo utilizando su identificador----*/
const getTrabajoById = async (req, res) => {

    try {

        const id_trabajo = Number(req.params.id_trabajo);

        /*----Comprobamos que el ID sea un número entero positivo----*/
        if (!Number.isSafeInteger(id_trabajo) || id_trabajo <= 0) {

            return res.status(400).json({
                error: "ID de trabajo no válido"
            });

        }

        /*----Buscamos el trabajo en la base de datos----*/
        const resultado = await trabajoModel.getTrabajoById(id_trabajo);

        /*----Comprobamos que el trabajo exista----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al obtener el trabajo:", error);

        return res.status(500).json({
            error: "Error al obtener el trabajo"
        });

    }

};


//=======CREAR TRABAJO=======//

/*----Registramos un nuevo trabajo asociado a un artista----*/
const createTrabajo = async (req, res) => {

    try {

        /*----Recogemos los datos enviados por el cliente----*/
        const { id_artista, titulo, descripcion, imagen } = req.body;

        const idArtista = Number(id_artista);

        /*----Comprobamos que el ID del artista sea válido----*/
        if (!Number.isSafeInteger(idArtista) || idArtista <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        /*----Comprobamos que los campos obligatorios sean válidos----*/
        if (
            typeof titulo !== "string" ||
            titulo.trim() === "" ||
            typeof descripcion !== "string" ||
            descripcion.trim() === ""
        ) {

            return res.status(400).json({
                error: "El título y la descripción son obligatorios"
            });

        }

        /*----Comprobamos que la imagen sea un texto si se proporciona----*/
        if (imagen !== undefined && imagen !== null && typeof imagen !== "string") {

            return res.status(400).json({
                error: "La imagen debe ser un texto válido"
            });

        }

        /*----Comprobamos que el usuario esté autenticado----*/
        if (!req.usuario) {

            return res.status(401).json({
                error: "Debes iniciar sesión"
            });

        }

        /*----Solo los administradores y artistas pueden crear trabajos----*/
        if (
            req.usuario.rol !== "admin" &&
            req.usuario.rol !== "artista"
        ) {

            return res.status(403).json({
                error: "No tienes permiso para crear trabajos"
            });

        }

        /*----Impedimos que un artista cree trabajos a nombre de otro artista----*/
        if (
            req.usuario.rol !== "admin" &&
            idArtista !== Number(req.usuario.id_usuario)
        ) {

            return res.status(403).json({
                error: "No puedes crear trabajos a nombre de otro artista"
            });

        }

        /*----Creamos el trabajo utilizando el modelo----*/
        const resultado = await trabajoModel.createTrabajo(
            idArtista,
            titulo.trim(),
            descripcion.trim(),
            imagen ?? null
        );

        /*----Devolvemos el trabajo creado----*/
        return res.status(201).json(resultado);

    } catch (error) {

        console.error("Error al crear el trabajo:", error);

        /*----Comprobamos si el artista indicado no existe en la base de datos----*/
        if (error.code === "23503") {

            return res.status(400).json({
                error: "El artista indicado no existe"
            });

        }

        return res.status(500).json({
            error: "Error al crear el trabajo"
        });

    }

};


//=======ACTUALIZAR TRABAJO=======//

/*----Actualizamos los datos de un trabajo existente----*/
const updateTrabajo = async (req, res) => {

    try {

        const id_trabajo = Number(req.params.id_trabajo);

        /*----Comprobamos que el ID del trabajo sea válido----*/
        if (!Number.isSafeInteger(id_trabajo) || id_trabajo <= 0) {

            return res.status(400).json({
                error: "ID de trabajo no válido"
            });

        }

        /*----Buscamos el trabajo antes de modificarlo----*/
        const trabajo = await trabajoModel.getTrabajoById(id_trabajo);

        if (!trabajo) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }

        /*----Comprobamos que el usuario esté autenticado----*/
        if (!req.usuario) {

            return res.status(401).json({
                error: "Debes iniciar sesión"
            });

        }

        /*----Solo el artista propietario o un administrador pueden modificarlo----*/
        if (
            req.usuario.rol !== "admin" &&
            (
                req.usuario.rol !== "artista" ||
                Number(trabajo.id_artista) !== Number(req.usuario.id_usuario)
            )
        ) {

            return res.status(403).json({
                error: "No tienes permiso para modificar este trabajo"
            });

        }

        /*----Recogemos los nuevos datos del trabajo----*/
        const { id_artista, titulo, descripcion, imagen } = req.body;

        const idArtista = Number(id_artista);

        /*----Comprobamos que el ID del artista sea válido----*/
        if (!Number.isSafeInteger(idArtista) || idArtista <= 0) {

            return res.status(400).json({
                error: "ID de artista no válido"
            });

        }

        /*----Comprobamos que el título y la descripción sean válidos----*/
        if (
            typeof titulo !== "string" ||
            titulo.trim() === "" ||
            typeof descripcion !== "string" ||
            descripcion.trim() === ""
        ) {

            return res.status(400).json({
                error: "El título y la descripción son obligatorios"
            });

        }

        /*----Comprobamos que la imagen sea un texto si se proporciona----*/
        if (imagen !== undefined && imagen !== null && typeof imagen !== "string") {

            return res.status(400).json({
                error: "La imagen debe ser un texto válido"
            });

        }

        /*----Impedimos que un artista cambie el propietario del trabajo----*/
        if (
            req.usuario.rol !== "admin" &&
            idArtista !== Number(trabajo.id_artista)
        ) {

            return res.status(403).json({
                error: "No puedes cambiar el propietario de este trabajo"
            });

        }

        /*----Enviamos los datos al modelo para actualizar el trabajo----*/
        const resultado = await trabajoModel.updateTrabajo(
            id_trabajo,
            idArtista,
            titulo.trim(),
            descripcion.trim(),
            imagen ?? null
        );

        /*----Comprobamos que el trabajo siga existiendo----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al actualizar el trabajo:", error);

        /*----Comprobamos si el artista indicado no existe----*/
        if (error.code === "23503") {

            return res.status(400).json({
                error: "El artista indicado no existe"
            });

        }

        return res.status(500).json({
            error: "Error al actualizar el trabajo"
        });

    }

};


//=======ELIMINAR TRABAJO=======//

/*----Eliminamos un trabajo utilizando su identificador----*/
const deleteTrabajo = async (req, res) => {

    try {

        const id_trabajo = Number(req.params.id_trabajo);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isSafeInteger(id_trabajo) || id_trabajo <= 0) {

            return res.status(400).json({
                error: "ID de trabajo no válido"
            });

        }

        /*----Buscamos el trabajo antes de eliminarlo----*/
        const trabajo = await trabajoModel.getTrabajoById(id_trabajo);

        if (!trabajo) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }

        /*----Comprobamos que el usuario esté autenticado----*/
        if (!req.usuario) {

            return res.status(401).json({
                error: "Debes iniciar sesión"
            });

        }

        /*----Solo el propietario o un administrador pueden eliminarlo----*/
        if (
            req.usuario.rol !== "admin" &&
            (
                req.usuario.rol !== "artista" ||
                Number(trabajo.id_artista) !== Number(req.usuario.id_usuario)
            )
        ) {

            return res.status(403).json({
                error: "No tienes permiso para eliminar este trabajo"
            });

        }

        /*----Eliminamos el trabajo desde el modelo----*/
        const resultado = await trabajoModel.deleteTrabajo(id_trabajo);

        /*----Comprobamos que el trabajo se haya eliminado----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }

        return res.status(200).json({
            mensaje: "Trabajo eliminado correctamente",
            trabajo: resultado
        });

    } catch (error) {

        console.error("Error al eliminar el trabajo:", error);

        /*----Comprobamos si existen registros relacionados que impiden eliminarlo----*/
        if (error.code === "23503") {

            return res.status(409).json({
                error: "No se puede eliminar el trabajo porque tiene registros relacionados"
            });

        }

        return res.status(500).json({
            error: "Error al eliminar el trabajo"
        });

    }

};


//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en las rutas de trabajos----*/
module.exports = {
    getTrabajos,
    getTrabajoById,
    createTrabajo,
    updateTrabajo,
    deleteTrabajo
};

