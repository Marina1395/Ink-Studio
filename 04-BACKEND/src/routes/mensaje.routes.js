
/*----Importamos Express para crear las rutas de mensajes----*/
const express = require("express");


/*----Importamos el controlador de mensajes----*/
const mensajeController = require("../controllers/mensaje.controller");


/*----Importamos los middlewares de autenticación y permisos----*/
const {
    verificarToken,
    verificarAdmin
} = require("../middlewares/auth.middleware");


//=======CREAR ROUTER=======//

/*----Creamos el router de Express----*/
const router = express.Router();


//=======RUTAS DE MENSAJES=======//

/*----Obtener todos los mensajes (solo administradores)----*/
router.get(
    "/",
    verificarToken,
    verificarAdmin,
    mensajeController.getMensajes
);


/*----Obtener un mensaje por su identificador (solo administradores)----*/
router.get(
    "/:id_mensaje",
    verificarToken,
    verificarAdmin,
    mensajeController.getMensajeById
);


/*----Crear un mensaje desde el formulario de contacto (ruta pública)----*/
router.post(
    "/",
    mensajeController.createMensaje
);


/*----Actualizar un mensaje existente (solo administradores)----*/
router.put(
    "/:id_mensaje",
    verificarToken,
    verificarAdmin,
    mensajeController.updateMensaje
);


/*----Eliminar un mensaje existente (solo administradores)----*/
router.delete(
    "/:id_mensaje",
    verificarToken,
    verificarAdmin,
    mensajeController.deleteMensaje
);


//=======EXPORTAR ROUTER=======//

/*----Exportamos el router para utilizarlo en app.js----*/
module.exports = router;
