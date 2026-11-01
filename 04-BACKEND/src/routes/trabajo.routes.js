
/*----Importamos Express para crear las rutas de trabajos----*/
const express = require("express");



/*----Importamos el controlador de trabajos----*/
const trabajoController = require("../controllers/trabajo.controller");


/*----Importamos los middlewares de autenticación y permisos----*/
const { verificarToken, verificarArtistaOAdmin } = require("../middlewares/auth.middleware");




//=======CREAR ROUTER=======//

/*----Creamos el router de Express----*/
const router = express.Router();


//==================== RUTAS DE TRABAJO ====================

/*----Obtener todos los trabajos registrados----*/
router.get("/", trabajoController.getTrabajos);

/*----Obtener un trabajo utilizando su identificador----*/
router.get("/:id_trabajo", trabajoController.getTrabajoById);

/*----Crear un trabajo (solo artistas y administradores)----*/
router.post("/",verificarToken, verificarArtistaOAdmin, trabajoController.createTrabajo);


//*----Actualizar un trabajo (solo su propietario o un administrador)----*/
router.put(

"/:id_trabajo", 
verificarToken,
verificarArtistaOAdmin,
trabajoController.updateTrabajo

);



/*----Eliminar un trabajo (solo su propietario o un administrador)----*/
router.delete(

"/:id_trabajo",
verificarToken,
verificarArtistaOAdmin,
trabajoController.deleteTrabajo

);

//========EXPORTAR ROUTES=======//
module.exports = router;