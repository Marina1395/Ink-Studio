

//Importamos el modelo del cliente
//"Controller, quiero utilizar las funciones que hemos creado en cliente";
const clienteModel = require("../models/cliente.model");


//Obtener todos los clientes
const getClientes = async(req, res) => {

    const clientes = await clienteModel.getClientes();

    res.json(clientes);

};




//Obtener clientes por su id
const getClienteById = async(req,res) => {

    const result = await clienteModel.getClienteById(req.params.id);
    res.json(result);
};




//Crear clientes
const createCliente = async(req,res) => {

    const cliente = await clienteModel.createCliente(req.body);
    res.json(cliente);

//Body contiene los datos que envia el usuario para crear un cliente.
};


//Actualizar clientes
const updateCliente = async(req,res) => {

    const cliente = await clienteModel.updateCliente(
    req.params.id,
    req.body
  );

  res.json(cliente);

};


//Eliminar cliente

const deleteCliente = async (req,res) => {

    const cliente = await clienteModel.deleteCliente(

        req.params.id,  
    );

    res.json(cliente);
};


//EXPORTAMOS FUNCIONES

module.exports = {

    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente

};
