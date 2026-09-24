

//IMPORTAMOS EXPRESS
const express = require("express");




//CREAMOS EL ROUTER
const router = express.Router();




//EXPORTAMOS EL ROUTER
module.exports = router;




//IMPORTAMOS EL CONTROLLERS DE CLIENTES
const clienteController = require("../controllers/cliente.controllers");



//OBTENER TODOS LOS CLIENTES
router.get("/" , clienteController.getClientes);



//OBTENER LOS CLIENTES POR SU ID
router.get("/:id", clienteController.getClienteById);



//RUTA PARA OBTENER UN CLIENTE
router.post("/", clienteController.createCliente);



//RUTA PARA ACTUALIZAR UN CLIENTE
router.put("/:id",clienteController.updateCliente);


//RUTA PARA ELIMINAR UN CLIENTE
router.delete("/:id",clienteController.deleteCliente);





