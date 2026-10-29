
//1.======IMPORTAMOS EXPRESS======//
const express = require("express");


//2.======IMPORTAMOS CONTROLLER======//
const citaController = require("../controllers/cita.controllers");


//3.======CREAMOS EL ROUTER======//
const router = express.Router();


//4.======CREAMOS LAS RUTAS======//
router.get("/", citaController.getCitas);
router.get("/disponibilidad", citaController.getDisponibilidad);
router.get("/:id_cita", citaController.getCitaById);
router.post("/", citaController.createCita);
router.put("/:id_cita", citaController.updateCita);
router.delete("/:id_cita", citaController.deleteCita);


//5.======EXPORTAMOS ROUTER=======//
module.exports = router;

