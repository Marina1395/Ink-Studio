

//1.=====IMPORTAMOS LALIBRERIA JSONWEBTOKEN DENTRO DE MIDDELWARE=====//
const jwt = require("jsonwebtoken");



//2.=====FUNCIÓN QUE COMPROBARÁ EL TOKEN=====//
const verificarToken = (req ,res, next) => {


    const authHeader = req.headers.authorization;


    if (!authHeader) {

        return res.status(401).json({

            error: "Token no proporcionado"

        });

  }

  //Separamos "Bearer" del token y guardamos solamente el token
  const token = authHeader.split(" ")[1];

  try{

    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuario;

    next();

    }catch(error){

    return res.status(401).json({

        error:"Token no válido"

    });

  }

};


//3.======FUNCIÓN QUE COMPROBARÁ SI EL USUARIO ES ADMINISTRADOR=====//
const verificarAdmin = (req, res, next) => {

    if( req.usuario.rol !== "admin") {

        return res.status(403).json({

            error: "No tienes permiso para realizar está acción"

        });

    }

    next()

};



//.4=====FUNCIÓN QUE COMPRUEBA SI ES EL PROPIO USUARIO O ADMIN=====//
const verificarPropietarioOAdmin = (req, res, next) => {

    const idUsuarioToken =req.usuario.id_usuario;

    const idUsuarioParams = Number(req.params.id_usuario);


    if(idUsuarioToken !== idUsuarioParams && req.usuario.rol !== "admin"){

        return res.status(403).json({

            error: "No tienes permiso para acceder a este usuario"

        });

    }

    next();



}



//=====COMPROBAR SI EL USUARIO ES ARTISTA O ADMINISTRADOR=====//

const verificarArtistaOAdmin = (req, res, next) => {

    /*---Comprobamos el rol del usuario---*/

    if(req.usuario.rol != "artista"  && req.usuario.rol != "admin"){

        return res.status(403).json({

            error: "Sólo los artistas y administradores pueden realizar esta acción"

        });

    }

    next();
}






//5.=====EXPORTAMOS MODULOS======//
module.exports = {

    verificarToken,
    verificarAdmin,
    verificarPropietarioOAdmin,
    verificarArtistaOAdmin
    
};