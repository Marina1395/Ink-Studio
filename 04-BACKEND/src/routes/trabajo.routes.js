//1. Importamos Express
const express = require("express");

//2. Creamos el router
const router = express.Router();

//3. Importamos el controller de trabajo
const trabajoController = require("../controllers/trabajo.controller");


//==================== RUTAS DE TRABAJO ====================

//Obtener todos los trabajos
router.get("/", trabajoController.getTrabajos);

//Obtener un trabajo por su id
router.get("/:id_trabajo", trabajoController.getTrabajoById);

//Crear un trabajo
router.post("/", trabajoController.createTrabajo);

//Actualizar un trabajo
router.put("/:id_trabajo", trabajoController.updateTrabajo);

//Eliminar un trabajo
router.delete("/:id_trabajo", trabajoController.deleteTrabajo);


//Exportamos las rutas
module.exports = router;