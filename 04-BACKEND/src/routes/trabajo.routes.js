//1. Importamos Express
const express = require("express");

//2. Creamos el router
const router = express.Router();

//3. Importamos el controller de trabajo
const trabajoController = require("../controllers/trabajo.controller");



const { verificarToken, verificarArtistaOAdmin } = require("../middlewares/auth.middleware");

//==================== RUTAS DE TRABAJO ====================

//Obtener todos los trabajos
router.get("/", trabajoController.getTrabajos);

//Obtener un trabajo por su id
router.get("/:id_trabajo", trabajoController.getTrabajoById);

//Crear un trabajo
router.post("/",verificarToken, verificarArtistaOAdmin, trabajoController.createTrabajo);


//Actualizar un trabajo
router.put(

"/:id_trabajo", 
verificarToken,
verificarArtistaOAdmin,
trabajoController.updateTrabajo

);

//Eliminar un trabajo
router.delete(

"/:id_trabajo",
verificarToken,
verificarArtistaOAdmin,
trabajoController.deleteTrabajo

);


//Exportamos las rutas
module.exports = router;