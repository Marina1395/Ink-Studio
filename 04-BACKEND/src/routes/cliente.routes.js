
/*----Importamos Express para crear las rutas de clientes----*/
const express = require("express");


/*----Importamos el controlador de clientes----*/
const clienteController = require("../controllers/cliente.controllers");


/*----Importamos los middlewares para comprobar el token y los permisos----*/
const {
    verificarToken,
    verificarAdmin
} = require("../middlewares/auth.middleware");


//=======CREAR ROUTER=======//

/*----Creamos el router de Express----*/
const router = express.Router();


//=======RUTAS DE CLIENTES=======//

/*----Obtener todos los clientes (solo administradores)----*/
router.get(
    "/",
    verificarToken,
    verificarAdmin,
    clienteController.getClientes
);


/*----Obtener un cliente por su ID (solo administradores)----*/
router.get(
    "/:id",
    verificarToken,
    verificarAdmin,
    clienteController.getClienteById
);


/*----Crear un nuevo cliente (solo administradores)----*/
router.post(
    "/",
    verificarToken,
    verificarAdmin,
    clienteController.createCliente
);


/*----Actualizar los datos de un cliente (solo administradores)----*/
router.put(
    "/:id",
    verificarToken,
    verificarAdmin,
    clienteController.updateCliente
);


/*----Eliminar un cliente (solo administradores)----*/
router.delete(
    "/:id",
    verificarToken,
    verificarAdmin,
    clienteController.deleteCliente
);


//=======EXPORTAR ROUTER=======//

/*----Exportamos el router para utilizarlo en app.js----*/
module.exports = router;


