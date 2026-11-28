
/*----Importamos el modelo de mensajes----*/
const mensajeModel = require("../models/mensaje.model");


//=======VALIDAR DATOS DEL MENSAJE=======//

/*----Comprobamos que los datos del mensaje sean correctos----*/
const validarMensaje = (nombre, email, asunto, mensaje) => {

    /*----Comprobamos que todos los campos sean textos con contenido----*/
    if (
        typeof nombre !== "string" ||
        nombre.trim() === "" ||
        typeof email !== "string" ||
        email.trim() === "" ||
        typeof asunto !== "string" ||
        asunto.trim() === "" ||
        typeof mensaje !== "string" ||
        mensaje.trim() === ""
    ) {

        return "Todos los campos son obligatorios";

    }

    /*----Comprobamos que el email tenga un formato válido----*/
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {

        return "El formato del email no es válido";

    }

    /*----Comprobamos que los campos no superen las longitudes permitidas----*/
    if (
        nombre.trim().length > 100 ||
        email.trim().length > 150 ||
        asunto.trim().length > 150 ||
        mensaje.trim().length > 5000
    ) {

        return "Uno o varios campos superan la longitud permitida";

    }

    /*----Si no encontramos errores, devolvemos null----*/
    return null;

};


//=======OBTENER TODOS LOS MENSAJES=======//

/*----Obtenemos todos los mensajes registrados en la base de datos----*/
const getMensajes = async (req, res) => {

    try {

        const resultado = await mensajeModel.getMensajes();

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al obtener los mensajes:", error);

        return res.status(500).json({
            error: "Ha ocurrido un error al obtener los mensajes"
        });

    }

};


//=======OBTENER MENSAJE POR ID=======//

/*----Buscamos un mensaje utilizando su identificador----*/
const getMensajeById = async (req, res) => {

    try {

        const id_mensaje = Number(req.params.id_mensaje);

        /*----Comprobamos que el ID sea un número entero positivo----*/
        if (!Number.isSafeInteger(id_mensaje) || id_mensaje <= 0) {

            return res.status(400).json({
                error: "ID de mensaje no válido"
            });

        }

        /*----Buscamos el mensaje en la base de datos----*/
        const resultado = await mensajeModel.getMensajeById(id_mensaje);

        /*----Comprobamos que el mensaje exista----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Mensaje no encontrado"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al obtener el mensaje:", error);

        return res.status(500).json({
            error: "Ha ocurrido un error al obtener el mensaje"
        });

    }

};


//=======CREAR MENSAJE=======//

/*----Registramos un nuevo mensaje enviado desde el formulario de contacto----*/
const createMensaje = async (req, res) => {

    try {

        /*----Recogemos los datos enviados por el cliente----*/
        const { nombre, email, asunto, mensaje } = req.body || {};

        /*----Validamos los datos antes de guardarlos----*/
        const errorValidacion = validarMensaje(
            nombre,
            email,
            asunto,
            mensaje
        );

        if (errorValidacion) {

            return res.status(400).json({
                error: errorValidacion
            });

        }

        /*----Creamos el mensaje utilizando el modelo----*/
        const resultado = await mensajeModel.createMensaje(
            nombre.trim(),
            email.trim().toLowerCase(),
            asunto.trim(),
            mensaje.trim()
        );

        /*----Confirmamos que el mensaje se ha registrado----*/
        return res.status(201).json({
            mensaje: "Mensaje enviado correctamente",
            id_mensaje: resultado.id_mensaje
        });

    } catch (error) {

        console.error("Error al crear el mensaje:", error);

        return res.status(500).json({
            error: "Ha ocurrido un error al crear el mensaje"
        });

    }

};


//=======ACTUALIZAR MENSAJE=======//

/*----Modificamos los datos de un mensaje existente----*/
const updateMensaje = async (req, res) => {

    try {

        const id_mensaje = Number(req.params.id_mensaje);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isSafeInteger(id_mensaje) || id_mensaje <= 0) {

            return res.status(400).json({
                error: "ID de mensaje no válido"
            });

        }

        /*----Recogemos los nuevos datos del mensaje----*/
        const { nombre, email, asunto, mensaje } = req.body || {};

        /*----Comprobamos que los datos sean correctos----*/
        const errorValidacion = validarMensaje(
            nombre,
            email,
            asunto,
            mensaje
        );

        if (errorValidacion) {

            return res.status(400).json({
                error: errorValidacion
            });

        }

        /*----Actualizamos el mensaje utilizando el modelo----*/
        const resultado = await mensajeModel.updateMensaje(
            id_mensaje,
            nombre.trim(),
            email.trim().toLowerCase(),
            asunto.trim(),
            mensaje.trim()
        );

        /*----Comprobamos que el mensaje exista----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Mensaje no encontrado"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error al actualizar el mensaje:", error);

        return res.status(500).json({
            error: "Ha ocurrido un error al actualizar el mensaje"
        });

    }

};


//=======ELIMINAR MENSAJE=======//

/*----Eliminamos un mensaje utilizando su identificador----*/
const deleteMensaje = async (req, res) => {

    try {

        const id_mensaje = Number(req.params.id_mensaje);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isSafeInteger(id_mensaje) || id_mensaje <= 0) {

            return res.status(400).json({
                error: "ID de mensaje no válido"
            });

        }

        /*----Eliminamos el mensaje utilizando el modelo----*/
        const resultado = await mensajeModel.deleteMensaje(id_mensaje);

        /*----Comprobamos que el mensaje exista----*/
        if (!resultado) {

            return res.status(404).json({
                error: "Mensaje no encontrado"
            });

        }

        /*----Confirmamos que el mensaje se ha eliminado correctamente----*/
        return res.status(200).json({
            mensaje: "Mensaje eliminado correctamente",
            mensajeEliminado: resultado
        });

    } catch (error) {

        console.error("Error al eliminar el mensaje:", error);

        return res.status(500).json({
            error: "Ha ocurrido un error al eliminar el mensaje"
        });

    }

};


//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en las rutas de mensajes----*/
module.exports = {
    getMensajes,
    getMensajeById,
    createMensaje,
    updateMensaje,
    deleteMensaje
};
