


const express = require("express");

/*----Importamos el limitador de solicitudes----*/
const { rateLimit } = require("express-rate-limit");


/*----Importamos el controlador de usuarios----*/
const usuarioController = require("../controllers/user.controller");


/*----Importamos los middlewares para comprobar el token y los permisos----*/
const {

    verificarToken,
    verificarAdmin,
    verificarPropietarioOAdmin

} = require("../middlewares/auth.middleware");



/*----Creamos un router de Express----*/
const router = express.Router();


/*----Limitamos las solicitudes de recuperación de contraseña----*/
const limiteRecuperacion = rateLimit({

    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: "Demasiados intentos. Vuelve a intentarlo en 15 minutos"
    }

});


/*----Limitamos los intentos de restablecimiento de contraseña----*/
const limiteRestablecimiento = rateLimit({

    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: "Demasiados intentos. Vuelve a intentarlo en 15 minutos"
    }

});



/*----Ruta para iniciar sesión----*/
router.post("/login", usuarioController.loginUser);

/*----Ruta para solicitar la recuperación de contraseña----*/
router.post(

    "/recuperar-contrasena",
    limiteRecuperacion,
    usuarioController.solicitarRecuperacionContrasena

);


/*----Ruta para restablecer la contraseña----*/
router.post(

    "/restablecer-contrasena",
    limiteRestablecimiento,
    usuarioController.restablecerContrasena

);



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


/*----Dar de baja a un cliente (administrador o propio cliente)----*/
router.delete(

    "/:id_usuario",
    verificarToken,
    usuarioController.deleteUser

);

/*----Exportamos el router para utilizarlo en app.js----*/
module.exports = router;


