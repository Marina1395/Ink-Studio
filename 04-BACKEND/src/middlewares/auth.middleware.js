

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


//3.=====EXPORTAMOS MODULOS======//

module.exports = {

    verificarToken

};