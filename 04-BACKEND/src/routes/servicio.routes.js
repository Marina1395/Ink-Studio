

//1.Importar express
const express = require("express");

//2.Creamos el router
const router = express.Router();

//3.Importar el controller de servicio
const servicioController = require("../controllers/servicio.controller");





//4.============RUTAS DE SERVICIO==============//
/*Obtener todos los servicios--->*/
router.get("/",servicioController.getServicios);

/*Obtener los servicios mediante su id---->*/
router.get("/:id_servicio",servicioController.getServicioById)

/*Crear un servicio---->*/
router.post("/",servicioController. createServicio);

/*Actualizar un servicio---->*/
router.put("/:id_servicio",servicioController.updateServicio);

/*Eliminar un servicio---->*/
router.delete("/:id_servicio",servicioController.deleteServicio);



//5.======EXPORTAMOS LAS RUTAS======
module.exports = router;






