
//1.======IMPORTAMOS EL MODEL DE MENSAJE======//
const mensajeModel = require("../models/mensaje.model");




//2.======OBTENER TODOS LOS MENSAJES======//
const getMensajes = async(req, res) => {

    try {

        const resultado = await mensajeModel.getMensajes();

        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al obtener los mensajes"
        });

    }

};




//3.======OBTENER MENSAJE POR ID======//
const getMensajeById = async(req, res) => {

    try {

        const { id_mensaje } = req.params;

        const resultado = await mensajeModel.getMensajeById(id_mensaje);

        if (!resultado) {

            return res.status(404).json({
                error: "Mensaje no encontrado"
            });

        }

        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al obtener el mensaje"
        });

    }

};




//4.======CREAR MENSAJE======//
const createMensaje = async(req, res) => {

    try {

        const {
            nombre,
            email,
            asunto,
            mensaje
        } = req.body;

        const resultado = await mensajeModel.createMensaje(
            nombre,
            email,
            asunto,
            mensaje
        );

        res.status(201).json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al crear el mensaje"
        });

    }

};




//5.======ACTUALIZAR MENSAJE======//
const updateMensaje = async(req, res) => {

    try {

        const { id_mensaje } = req.params;

        const {
            nombre,
            email,
            asunto,
            mensaje
        } = req.body;

        const resultado = await mensajeModel.updateMensaje(
            id_mensaje,
            nombre,
            email,
            asunto,
            mensaje
        );

        if (!resultado) {

            return res.status(404).json({
                error: "Mensaje no encontrado"
            });

        }

        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al actualizar el mensaje"
        });

    }

};




//6.======ELIMINAR MENSAJE======//
const deleteMensaje = async(req, res) => {

    try {

        const { id_mensaje } = req.params;

        const resultado = await mensajeModel.deleteMensaje(id_mensaje);

        if (!resultado) {

            return res.status(404).json({
                error: "Mensaje no encontrado"
            });

        }

        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al eliminar el mensaje"
        });

    }

};




//7.======EXPORTAMOS LAS FUNCIONES======//
module.exports = {

    getMensajes,
    getMensajeById,
    createMensaje,
    updateMensaje,
    deleteMensaje

};