
/*----Importamos el modelo de servicios----*/
const servicioModel = require("../models/servicio.model");


//=======OBTENER TODOS LOS SERVICIOS=======//

/*----Obtenemos todos los servicios registrados en la base de datos----*/
const getServicios = async (req, res) => {

    try {

        const servicios = await servicioModel.getServicios();

        return res.status(200).json(servicios);

    } catch (error) {

        console.error("Error al obtener los servicios:", error);

        return res.status(500).json({
            error: "Error al obtener los servicios"
        });

    }

};


//=======OBTENER SERVICIO POR ID=======//

/*----Buscamos un servicio utilizando su identificador----*/
const getServicioById = async (req, res) => {

    try {

        const id_servicio = Number(req.params.id_servicio);

        /*----Comprobamos que el ID sea un número entero positivo----*/
        if (!Number.isSafeInteger(id_servicio) || id_servicio <= 0) {

            return res.status(400).json({
                error: "ID de servicio no válido"
            });

        }

        /*----Buscamos el servicio en la base de datos----*/
        const servicio = await servicioModel.getServicioById(id_servicio);

        /*----Comprobamos que el servicio exista----*/
        if (!servicio) {

            return res.status(404).json({
                error: "Servicio no encontrado"
            });

        }

        return res.status(200).json(servicio);

    } catch (error) {

        console.error("Error al obtener el servicio:", error);

        return res.status(500).json({
            error: "Error al obtener el servicio"
        });

    }

};


//=======CREAR SERVICIO=======//

/*----Registramos un nuevo servicio en la base de datos----*/
const createServicio = async (req, res) => {

    try {

        /*----Recogemos los datos enviados por el cliente----*/
        const { nombre, descripcion, precio } = req.body;

        /*----Comprobamos que el nombre y la descripción sean textos válidos----*/
        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            typeof descripcion !== "string" ||
            descripcion.trim() === ""
        ) {

            return res.status(400).json({
                error: "El nombre y la descripción son obligatorios"
            });

        }

        /*----Comprobamos que el precio sea un número válido y no sea negativo----*/
        if (
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio < 0
        ) {

            return res.status(400).json({
                error: "El precio debe ser un número válido y no puede ser negativo"
            });

        }

        /*----Creamos el nuevo servicio utilizando el modelo----*/
        const nuevoServicio = await servicioModel.createServicio(
            nombre.trim(),
            descripcion.trim(),
            precio
        );

        /*----Devolvemos el servicio que acabamos de crear----*/
        return res.status(201).json(nuevoServicio);

    } catch (error) {

        console.error("Error al crear el servicio:", error);

        /*----Comprobamos si existe otro registro con los mismos datos únicos----*/
        if (error.code === "23505") {

            return res.status(409).json({
                error: "Ya existe un servicio con esos datos"
            });

        }

        return res.status(500).json({
            error: "Error al crear el servicio"
        });

    }

};


//=======ACTUALIZAR SERVICIO=======//

/*----Actualizamos los datos de un servicio existente----*/
const updateServicio = async (req, res) => {

    try {

        const id_servicio = Number(req.params.id_servicio);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isSafeInteger(id_servicio) || id_servicio <= 0) {

            return res.status(400).json({
                error: "ID de servicio no válido"
            });

        }

        /*----Recogemos los datos que queremos actualizar----*/
        const { nombre, descripcion, precio } = req.body;

        /*----Comprobamos que el nombre y la descripción sean válidos----*/
        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            typeof descripcion !== "string" ||
            descripcion.trim() === ""
        ) {

            return res.status(400).json({
                error: "El nombre y la descripción son obligatorios"
            });

        }

        /*----Comprobamos que el precio sea válido y no sea negativo----*/
        if (
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio < 0
        ) {

            return res.status(400).json({
                error: "El precio debe ser un número válido y no puede ser negativo"
            });

        }

        /*----Enviamos los datos al modelo para actualizar el servicio----*/
        const servicioActualizado = await servicioModel.updateServicio(
            id_servicio,
            nombre.trim(),
            descripcion.trim(),
            precio
        );

        /*----Comprobamos que el servicio exista----*/
        if (!servicioActualizado) {

            return res.status(404).json({
                error: "Servicio no encontrado"
            });

        }

        /*----Devolvemos el servicio actualizado----*/
        return res.status(200).json(servicioActualizado);

    } catch (error) {

        console.error("Error al actualizar el servicio:", error);

        if (error.code === "23505") {

            return res.status(409).json({
                error: "Ya existe un servicio con esos datos"
            });

        }

        return res.status(500).json({
            error: "Error al actualizar el servicio"
        });

    }

};


//=======ELIMINAR SERVICIO=======//

/*----Eliminamos un servicio utilizando su identificador----*/
const deleteServicio = async (req, res) => {

    try {

        const id_servicio = Number(req.params.id_servicio);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isSafeInteger(id_servicio) || id_servicio <= 0) {

            return res.status(400).json({
                error: "ID de servicio no válido"
            });

        }

        /*----Eliminamos el servicio utilizando el modelo----*/
        const servicioEliminado = await servicioModel.deleteServicio(id_servicio);

        /*----Comprobamos que el servicio exista----*/
        if (!servicioEliminado) {

            return res.status(404).json({
                error: "Servicio no encontrado"
            });

        }

        /*----Devolvemos una confirmación junto con el servicio eliminado----*/
        return res.status(200).json({
            mensaje: "Servicio eliminado correctamente",
            servicio: servicioEliminado
        });

    } catch (error) {

        console.error("Error al eliminar el servicio:", error);

        /*----Comprobamos si existen registros relacionados que impiden eliminarlo----*/
        if (error.code === "23503") {

            return res.status(409).json({
                error: "No se puede eliminar el servicio porque tiene registros relacionados"
            });

        }

        return res.status(500).json({
            error: "Error al eliminar el servicio"
        });

    }

};


//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en las rutas de servicios----*/
module.exports = {
    getServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio
};
