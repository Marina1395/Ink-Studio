
/*----Importamos Express para crear las rutas de artistas----*/
const express = require("express");


/*----Importamos el controlador de artistas----*/
const artistaController = require("../controllers/artista.controller");


/*----Importamos los middlewares para comprobar el token y los permisos----*/
const {

    verificarToken,
    verificarAdmin
    
} = require("../middlewares/auth.middleware");


//=======CREAR ROUTER=======//

/*----Creamos el router de Express----*/
const router = express.Router();


//=======RUTAS DE ARTISTAS=======//

/*----Obtener todos los artistas registrados----*/
router.get(

    "/",
    artistaController.getArtistas

);


/*----Obtener un artista utilizando su ID de usuario----*/
router.get(

    "/:id_usuario",
    artistaController.getArtistaById

);


/*----Registrar un nuevo artista (solo administradores)----*/
router.post(

    "/",
    verificarToken,
    verificarAdmin,
    artistaController.createArtista

);


/*----Actualizar los datos de un artista (solo administradores)----*/
router.put(

    "/:id_usuario",
    verificarToken,
    verificarAdmin,
    artistaController.updateArtista

);


/*----Eliminar el perfil de un artista (solo administradores)----*/
router.delete(

    "/:id_usuario",
    verificarToken,
    verificarAdmin,
    artistaController.deleteArtista

);


//=======EXPORTAR ROUTER=======//

/*----Exportamos el router para utilizarlo en app.js----*/
module.exports = router;
