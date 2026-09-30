//1.======IMPORTAMOS EXPRESS======//
const express = require("express");


//2.======IMPORTAMOS EL CONTROLLER======//
const mensajeController = require("../controllers/mensaje.controller");


//3.======CREAMOS EL ROUTER======//
const router = express.Router();


//4.======CREAMOS LAS RUTAS======//

// Obtener todos los mensajes
router.get("/", mensajeController.getMensajes);

// Obtener un mensaje por su ID
router.get("/:id_mensaje", mensajeController.getMensajeById);

// Crear un mensaje
router.post("/", mensajeController.createMensaje);

// Actualizar un mensaje
router.put("/:id_mensaje", mensajeController.updateMensaje);

// Eliminar un mensaje
router.delete("/:id_mensaje", mensajeController.deleteMensaje);


//5.======EXPORTAMOS ROUTER======//
module.exports = router;