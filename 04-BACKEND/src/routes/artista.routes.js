// Importamos Express
const express = require("express");

// Creamos el router
const router = express.Router();

// Importamos las funciones del controller
const artistaController = require("../controllers/artista.controller");


// GET - Obtener todos los artistas
router.get("/", artistaController.getArtistas);


// GET - Obtener un artista por su id_usuario
router.get("/:id_usuario", artistaController.getArtistaById);


// POST - Crear un artista
router.post("/", artistaController.createArtista);


// PUT - Actualizar un artista
router.put("/:id_usuario", artistaController.updateArtista);


// DELETE - Borrar un artista
router.delete("/:id_usuario", artistaController.deleteArtista);


// Exportamos el router
module.exports = router;