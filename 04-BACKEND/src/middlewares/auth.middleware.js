
/*----Importamos la librería jsonwebtoken para verificar los tokens----*/
const jwt = require("jsonwebtoken");

/*----Importamos el modelo de artistas para comprobar su estado----*/
const artistaModel = require("../models/artista.model");


//=======VERIFICAR TOKEN=======//

/*----Comprobamos que el usuario haya enviado un token válido----*/
const verificarToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    /*----Comprobamos que se haya enviado la cabecera de autorización----*/
    if (!authHeader) {

        return res.status(401).json({
            error: "Token no proporcionado"
        });

    }

    /*----Comprobamos que el token tenga el formato Bearer correcto----*/
    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer" || !partes[1]) {

        return res.status(401).json({
            error: "Formato del token incorrecto"
        });

    }

    /*----Guardamos únicamente el token----*/
    const token = partes[1];

    let usuario;

    try {

        /*----Verificamos el token utilizando nuestra clave secreta----*/
        usuario = jwt.verify(token, process.env.JWT_SECRET);

    } catch (error) {

        return res.status(401).json({
            error: "Token no válido o caducado"
        });

    }

    /*----Comprobamos que el token contenga los datos necesarios----*/
    if (
        !usuario ||
        !Number.isInteger(usuario.id_usuario) ||
        usuario.id_usuario <= 0 ||
        typeof usuario.rol !== "string"
    ) {

        return res.status(401).json({
            error: "Token no válido"
        });

    }

    try {

        /*----Comprobamos el estado de los usuarios con rol artista----*/
        if (usuario.rol === "artista") {

            const artista = await artistaModel.getArtistaById(
                usuario.id_usuario
            );

            /*----Bloqueamos el acceso si el artista está dado de baja----*/
            if (!artista || artista.activo !== true) {

                return res.status(403).json({
                    error: "Tu cuenta de artista está desactivada"
                });

            }

        }

        /*----Guardamos los datos del usuario para utilizarlos en otras funciones----*/
        req.usuario = usuario;

        /*----Permitimos que la petición continúe----*/
        next();

    } catch (error) {

        console.error(
            "Error al comprobar el estado del artista:",
            error
        );

        return res.status(500).json({
            error: "Error al verificar el acceso del usuario"
        });

    }

};


//=======VERIFICAR ADMINISTRADOR=======//

/*----Comprobamos que el usuario tenga el rol de administrador----*/
const verificarAdmin = (req, res, next) => {

    if (!req.usuario || req.usuario.rol !== "admin") {

        return res.status(403).json({
            error: "No tienes permiso para realizar esta acción"
        });

    }

    next();

};


//=======VERIFICAR PROPIETARIO O ADMINISTRADOR=======//

/*----Comprobamos que el usuario acceda a su propia cuenta o sea administrador----*/
const verificarPropietarioOAdmin = (req, res, next) => {

    if (!req.usuario) {

        return res.status(401).json({
            error: "Usuario no autenticado"
        });

    }

    /*----Obtenemos el ID del usuario que ha iniciado sesión----*/
    const idUsuarioToken = req.usuario.id_usuario;

    /*----Obtenemos el ID del usuario indicado en la URL----*/
    const idUsuarioParams = Number(req.params.id_usuario);

    /*----Comprobamos que el ID de la URL sea válido----*/
    if (!Number.isInteger(idUsuarioParams) || idUsuarioParams <= 0) {

        return res.status(400).json({
            error: "ID de usuario no válido"
        });

    }

    /*----Permitimos el acceso al propietario de la cuenta o al administrador----*/
    if (
        idUsuarioToken !== idUsuarioParams &&
        req.usuario.rol !== "admin"
    ) {

        return res.status(403).json({
            error: "No tienes permiso para acceder a este usuario"
        });

    }

    next();

};


//=======VERIFICAR ARTISTA O ADMINISTRADOR=======//

/*----Comprobamos que el usuario sea artista o administrador----*/
const verificarArtistaOAdmin = (req, res, next) => {

    if (
        !req.usuario ||
        (
            req.usuario.rol !== "artista" &&
            req.usuario.rol !== "admin"
        )
    ) {

        return res.status(403).json({
            error: "Solo los artistas y administradores pueden realizar esta acción"
        });

    }

    next();

};


//=======EXPORTAR MIDDLEWARES=======//

/*----Exportamos las funciones para utilizarlas en las rutas----*/
module.exports = {
    verificarToken,
    verificarAdmin,
    verificarPropietarioOAdmin,
    verificarArtistaOAdmin
};
