
/*----Importamos Express para crear las rutas de servicios----*/
const express = require("express");


/*----Importamos el controlador de servicios----*/
const servicioController = require("../controllers/servicio.controller");


/*----Importamos los middlewares de autenticación y permisos----*/
const {
    verificarToken,
    verificarAdmin
} = require("../middlewares/auth.middleware");


//=======CREAR ROUTER=======//

/*----Creamos el router de Express----*/
const router = express.Router();


//=======RUTAS DE SERVICIOS=======//

/*----Obtener todos los servicios registrados----*/
router.get(
    "/",
    servicioController.getServicios
);


/*----Obtener un servicio utilizando su identificador----*/
router.get(
    "/:id_servicio",
    servicioController.getServicioById
);


/*----Crear un nuevo servicio (solo administradores)----*/
router.post(
    "/",
    verificarToken,
    verificarAdmin,
    servicioController.createServicio
);


/*----Actualizar un servicio existente (solo administradores)----*/
router.put(
    "/:id_servicio",
    verificarToken,
    verificarAdmin,
    servicioController.updateServicio
);


/*----Eliminar un servicio (solo administradores)----*/
router.delete(
    "/:id_servicio",
    verificarToken,
    verificarAdmin,
    servicioController.deleteServicio
);


//=======EXPORTAR ROUTER=======//

/*----Exportamos el router para utilizarlo en app.js----*/
module.exports = router;
