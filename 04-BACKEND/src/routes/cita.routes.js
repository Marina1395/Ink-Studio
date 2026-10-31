
const express = require("express");

const citaController = require("../controllers/cita.controllers");

const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();


// ===== CONSULTAR DISPONIBILIDAD =====
// Esta ruta es pública porque cualquier visitante
// puede consultar los horarios disponibles.
router.get(
    "/disponibilidad",
    citaController.getDisponibilidad
);


// ===== OBTENER TODAS LAS CITAS =====
router.get(
    "/",
    verificarToken,
    citaController.getCitas
);


// ===== OBTENER UNA CITA POR ID =====
router.get(
    "/:id_cita",
    verificarToken,
    citaController.getCitaById
);


// ===== CREAR UNA CITA =====
router.post(
    "/",
    verificarToken,
    citaController.createCita
);


// ===== ACTUALIZAR UNA CITA =====
router.put(
    "/:id_cita",
    verificarToken,
    citaController.updateCita
);


// ===== ELIMINAR UNA CITA =====
router.delete(
    "/:id_cita",
    verificarToken,
    citaController.deleteCita
);


// ===== EXPORTAR RUTAS =====
module.exports = router;
