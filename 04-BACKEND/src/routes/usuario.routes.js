

//Importamos express para poder crear las rutas
const express = require("express");



//Importamos el controller de usuarios
const usuarioController = require("../controllers/user.controller");


//Importamos el middelware que comprueba el Token
const { verificarToken } =require("../middlewares/auth.middleware");



//Creamos un router de express
const router = express.Router();



//Iniciar sesión
router.post("/login", usuarioController.loginUser);




//Obtener todos los usuarios
router.get("/", verificarToken, usuarioController.getUsers);


//"Dame el usuario cuyo ID sea el que aparece en la URL."
router.get("/:id_usuario", usuarioController.getUserById);


//Crear un usuario
router.post("/", usuarioController.createUser); 


//Actualizar un usuario
router.put("/:id_usuario", usuarioController.updateUser);


//Eliminar un usuario
router.delete("/:id_usuario", usuarioController.deleteUser);


module.exports = router;


//=====IMPORTANTE======//
/* Las operaciones CRUD sobre las bases de datos se programan principalmente en el MODEL,pero
para que funcionen desde una petición necesitamos necesitamos tambien Controllers+routes*/


