
/*----Importamos el modelo para utilizar las funciones de los clientes----*/
const clienteModel = require("../models/cliente.model");


//=======OBTENER TODOS LOS CLIENTES=======//

/*----Obtenemos todos los clientes registrados----*/
const getClientes = async (req, res) => {

    try {

        const clientes = await clienteModel.getClientes();

        return res.status(200).json(clientes);

    } catch (error) {

        console.error("Error al obtener los clientes:", error);

        return res.status(500).json({
            error: "Error interno al obtener los clientes"
        });

    }

};


//=======OBTENER CLIENTE POR ID=======//

/*----Buscamos un cliente utilizando el ID de la URL----*/
const getClienteById = async (req, res) => {

    try {

        const id = Number(req.params.id);

        /*----Comprobamos que el ID sea un número válido----*/
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "ID de cliente no válido"
            });

        }

        const cliente = await clienteModel.getClienteById(id);

        /*----Comprobamos que el cliente exista----*/
        if (!cliente) {

            return res.status(404).json({
                error: "Cliente no encontrado"
            });

        }

        return res.status(200).json(cliente);

    } catch (error) {

        console.error("Error al obtener el cliente:", error);

        return res.status(500).json({
            error: "Error interno al obtener el cliente"
        });

    }

};


//=======CREAR CLIENTE=======//

/*----Creamos un nuevo cliente con los datos recibidos----*/
const createCliente = async (req, res) => {

    try {

        const { nombre, apellidos, telefono, direccion, id_usuario } = req.body;

        /*----Comprobamos que los datos obligatorios estén presentes----*/
        if (
            typeof nombre !== "string" ||
            typeof apellidos !== "string" ||
            typeof telefono !== "string" ||
            typeof direccion !== "string" ||
            nombre.trim() === "" ||
            apellidos.trim() === "" ||
            telefono.trim() === "" ||
            direccion.trim() === ""
        ) {

            return res.status(400).json({
                error: "Nombre, apellidos, teléfono y dirección son obligatorios"
            });

        }

        /*----Comprobamos que el ID del usuario sea válido----*/
        const idUsuario = Number(id_usuario);

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {

            return res.status(400).json({
                error: "ID de usuario no válido"
            });

        }

        /*----Guardamos el cliente en la base de datos----*/
        const cliente = await clienteModel.createCliente({
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono.trim(),
            direccion: direccion.trim(),
            id_usuario: idUsuario
        });

        return res.status(201).json(cliente);

    } catch (error) {

        console.error("Error al crear el cliente:", error);

        /*----Comprobamos si existe un conflicto con los datos de PostgreSQL----*/
        if (error.code === "23505") {

            return res.status(409).json({
                error: "Ya existe un registro con esos datos"
            });

        }

        if (error.code === "23503") {

            return res.status(400).json({
                error: "El usuario indicado no existe"
            });

        }

        return res.status(500).json({
            error: "Error interno al crear el cliente"
        });

    }

};


//=======ACTUALIZAR CLIENTE=======//

/*----Actualizamos los datos de un cliente existente----*/
const updateCliente = async (req, res) => {

    try {

        const id = Number(req.params.id);
        const { nombre, apellidos, telefono, direccion, id_usuario } = req.body;

        /*----Comprobamos que el ID del cliente sea válido----*/
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "ID de cliente no válido"
            });

        }

        /*----Comprobamos que los datos obligatorios sean correctos----*/
        if (
            typeof nombre !== "string" ||
            typeof apellidos !== "string" ||
            typeof telefono !== "string" ||
            typeof direccion !== "string" ||
            nombre.trim() === "" ||
            apellidos.trim() === "" ||
            telefono.trim() === "" ||
            direccion.trim() === ""
        ) {

            return res.status(400).json({
                error: "Nombre, apellidos, teléfono y dirección son obligatorios"
            });

        }

        const idUsuario = Number(id_usuario);

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {

            return res.status(400).json({
                error: "ID de usuario no válido"
            });

        }

        /*----Actualizamos el cliente en la base de datos----*/
        const cliente = await clienteModel.updateCliente(id, {
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono.trim(),
            direccion: direccion.trim(),
            id_usuario: idUsuario
        });

        /*----Comprobamos si el cliente existe----*/
        if (!cliente) {

            return res.status(404).json({
                error: "Cliente no encontrado"
            });

        }

        return res.status(200).json(cliente);

    } catch (error) {

        console.error("Error al actualizar el cliente:", error);

        if (error.code === "23505") {

            return res.status(409).json({
                error: "Ya existe un registro con esos datos"
            });

        }

        if (error.code === "23503") {

            return res.status(400).json({
                error: "El usuario indicado no existe"
            });

        }

        return res.status(500).json({
            error: "Error interno al actualizar el cliente"
        });

    }

};


//=======ELIMINAR CLIENTE=======//

/*----Eliminamos un cliente utilizando su ID----*/
const deleteCliente = async (req, res) => {

    try {

        const id = Number(req.params.id);

        /*----Comprobamos que el ID sea válido----*/
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "ID de cliente no válido"
            });

        }

        /*----Eliminamos el cliente de la base de datos----*/
        const cliente = await clienteModel.deleteCliente(id);

        /*----Comprobamos que el cliente exista----*/
        if (!cliente) {

            return res.status(404).json({
                error: "Cliente no encontrado"
            });

        }

        return res.status(200).json({
            mensaje: "Cliente eliminado correctamente",
            cliente
        });

    } catch (error) {

        console.error("Error al eliminar el cliente:", error);

        /*----Comprobamos si existen registros relacionados que impiden eliminarlo----*/
        if (error.code === "23503") {

            return res.status(409).json({
                error: "No se puede eliminar el cliente porque tiene registros relacionados"
            });

        }

        return res.status(500).json({
            error: "Error interno al eliminar el cliente"
        });

    }

};


//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en las rutas de clientes----*/
module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};
