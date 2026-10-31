/*----Importamos Express, el controlador de citas y el middleware de autenticación----*/
const express = require("express");
const citaController = require("../controllers/cita.controllers");
const { verificarToken } = require("../middlewares/auth.middleware");


/*----Creamos el router donde vamos a definir las rutas de las citas----*/
const router = express.Router();



//=======CONSULTAR DISPONIBILIDAD=======//

/*----Esta ruta es pública para que cualquier persona pueda consultar los horarios disponibles----*/
router.get("/disponibilidad", citaController.getDisponibilidad);


//=======OBTENER TODAS LAS CITAS=======//
/*----Comprobamos que el usuario esté autenticado antes de consultar las citas----*/
router.get("/", verificarToken, citaController.getCitas);



///=======OBTENER CITA POR ID=======//
/*----Recogemos el ID de la cita por la URL y comprobamos que el usuario esté autenticado----*/
router.get("/:id_cita", verificarToken, citaController.getCitaById);


//=======CREAR CITA=======//
/*----Comprobamos que el usuario haya iniciado sesión antes de solicitar una cita----*/
router.post("/", verificarToken, citaController.createCita);


//=======ACTUALIZAR CITA=======//
/*----Comprobamos que el usuario esté autenticado antes de modificar una cita----*/
router.put("/:id_cita", verificarToken, citaController.updateCita);


//=======ELIMINAR CITA=======//
/*----Comprobamos que el usuario esté autenticado antes de eliminar una cita----*/
router.delete("/:id_cita", verificarToken, citaController.deleteCita);


//====== EXPORTAR RUTAS======//
module.exports = router;
