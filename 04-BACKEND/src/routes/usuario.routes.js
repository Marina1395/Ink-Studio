


const express = require("express");



/*----Importamos el controlador de usuarios----*/
const usuarioController = require("../controllers/user.controller");


/*----Importamos los middlewares para comprobar el token y los permisos----*/
const {

  verificarToken,
  verificarAdmin ,
  verificarPropietarioOAdmin

} =require("../middlewares/auth.middleware");



/*----Creamos un router de Express----*/
const router = express.Router();



/*----Ruta para iniciar sesión----*/
router.post("/login", usuarioController.loginUser);



/*----Ruta para obtener todos los usuarios (solo administradores)----*/
router.get(

    "/",
     verificarToken,
     verificarAdmin,
      usuarioController.getUsers

    );


/*----Ruta para obtener un usuario por su ID----*/
router.get(

    "/:id_usuario", 
    verificarToken,
    verificarPropietarioOAdmin,
    usuarioController.getUserById

);


/*----Registrar un nuevo usuario----*/
router.post("/", usuarioController.createUser); 


/*----Actualizar los datos de un usuario----*/
router.put(

    "/:id_usuario",
    verificarToken,
    verificarPropietarioOAdmin,
    usuarioController.updateUser);


/*----Eliminar a un usuario(solo administradores)---*/
router.delete(

    "/:id_usuario",
    verificarToken,
    verificarAdmin,
    usuarioController.deleteUser

);

/*----Exportamos el router para utilizarlo en app.js----*/
module.exports = router;


