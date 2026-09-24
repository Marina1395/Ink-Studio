
//1. Importamos el modelo de servicio
const servicioModel = require("../models/servicio.model");


//==================== OBTENER TODOS LOS SERVICIOS ====================

const getServicios = async (req, res) => {

    try {

        const servicios = await servicioModel.getServicios();

        res.json(servicios);

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener los servicios"
        });

    }

};


//==================== OBTENER UN SERVICIO POR ID ====================

const getServicioById = async (req, res) => {

    try {

        const id_servicio = req.params.id_servicio;

        const servicio = await servicioModel.getServicioById(id_servicio);

        if (!servicio) {

            return res.status(404).json({
                error: "Servicio no encontrado"
            });

        }

        res.json(servicio);

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener el servicio"
        });

    }

};




//==== CREAR UN SERVICIO =====//

const createServicio = async (req, res) => {

    try {

        const { id_servicio, nombre, descripcion, precio } = req.body;

        const nuevoServicio = await servicioModel.createServicio(
            id_servicio,
            nombre,
            descripcion,
            precio
        );

        res.status(201).json(nuevoServicio);

    } catch (error) {

        res.status(500).json({
            error: "Error al crear el servicio"
        });

    }

};


//=====ACTUALIZAR SERVICIO ======//

const updateServicio = async (req, res) => {

    try {

        const id_servicio = req.params.id_servicio;

        const { nombre, descripcion, precio } = req.body;

        const servicioActualizado = await servicioModel.updateServicio(
            id_servicio,
            nombre,
            descripcion,
            precio
        );

        if (!servicioActualizado) {

            return res.status(404).json({
                error: "Servicio no encontrado"
            });

        }

        res.json(servicioActualizado);

    } catch (error) {

        res.status(500).json({
            error: "Error al actualizar el servicio"
        });

    }

};


//=====ELIMINAR SERVICIO=====//

const deleteServicio = async (req, res) => {

    try {

        const id_servicio = req.params.id_servicio;

        const servicioEliminado = await servicioModel.deleteServicio(id_servicio);

        if (!servicioEliminado) {

            return res.status(404).json({
                error: "Servicio no encontrado"
            });

        }

        res.json(servicioEliminado);

    } catch (error) {

        res.status(500).json({
            error: "Error al eliminar el servicio"
        });

    }

};


//====EXPORTAR TODAS LAS FUNCIONES ===== //

module.exports = {

    getServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio

};