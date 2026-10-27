

const artistaModel = require("../models/artista.model");
const usuarioModel= require("../models/user.model");



//Esta funcion se ejecuta cuando recibimos una peticion para obtener los resultados de artistas.
const getArtistas= async (req,res) =>{

   try{

        //LLamamos a la funcion getArtistas del modelo
        //Await espera a que postgre nos devuelva los datos

        const resultado = await artistaModel.getArtistas();
        res.json(resultado);

    }catch(error){

        //Si ocurre algun error lo mostramos por consola
        console.error(error);

        //Enviamos al cliente codigo http 500 que significa que ha ocurrido un error en el servidor.
        res.status(500).json({

            //Mensaje que recibira el cliente
            error:"Error al obtener los artistas",

        });

    }

};






//Esta función se ejecuta cuando recibimos una peticion sobre los artistas por su id
const getArtistaById = async(req,res) => {

    try{

        const resultado = await artistaModel.getArtistaById(req.params.id_usuario);
        res.json(resultado);
   
    }catch(error){

        //Si ocurre algun error lo mostramos por consola.
        console.error(error)


        //Enviamos al cliente codigo http 500 que significa que ha ocurrido un error en el servidor
        res.status(500).json({

        error:"Error al obtener al artista por su id"   

        });

    }


};




//Esta funcion se ejecuta cuando recibimos una peticion sobre para crear usuarios.

const createArtista = async(req,res) => {

    try {

        /*Recibimos los datos del nuevo artista*/
        const {nombre, email, contrasena, especialidad, descripcion} = req.body;


        /*Comprobaremos que estén los datos obligatorios*/
        if(!nombre || !email || !contrasena || !especialidad || !descripcion){

            return res.status(400).json({

                error: "Faltan los campos obligatorios"

            });
        }


        /*Comprobamos la longitud de la contraseña*/
        if(contrasena.length < 8 || contrasena.length > 72) {

            return res.status(400).json({

                error: "La contraseña debe tener entre 8 y 72 caracteres"
            })
        }


        /*Comprobamos que el email no este registrado*/
        const usuarioExistente = await usuarioModel.getUserByEmail(email);

        if(usuarioExistente){

            return res.status(409).json({

                error: "Ya existe un usuario con ese email"

            });
        }


        /*Creamos su cuenta con el rol artista*/
        /*createUser protege la contraseá con bcryp*/

        const nuevoUsuario = await usuarioModel.createUser(

            nombre,
            email,
            contrasena,
            "artista"

        );


        /*Obtenemos el ID generado por PostgreSQL*/
         const id_usuario = nuevoUsuario.rows[0].id_usuario;


        /*Creamos su perfil profesional*/ 
        const nuevoArtista = await artistaModel.createArtista(

            id_usuario,
            especialidad,
            descripcion || ""

        );


        /*Respondemos sin devolver la contraseña*/
        return res.status(201).json({

            mensaje:"Artista registrado correctamente",
            usuario: nuevoUsuario.rows[0],
            artista: nuevoArtista

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error: "Error al registrar el artista"

         });

    }

};



    const updateArtista = async(req, res) => {

        try{

            //Cogemos el id_usuario de la URL
            const id_usuario = req.params.id_usuario;

            //Cogemos los datos que queremos modificar
            const{ especialidad, descripcion }=req.body;

            //Creamos un objeto con los datos del artista

            const artista = {

                especialidad,
                descripcion

            };

            //Llamamos a la funcion updateArtista de model
           const resultado = await artistaModel.updateArtista(

                id_usuario,
                artista

            );

            //Enviamos el artista actualizado
            res.json(resultado);
      
            
        }catch(error){

            //Mostramos el error en la consola
            console.error(error);

            //Enviamos al cliente
            res.status(500).json({

                error: "Error al actualizar el artista"

            });
        }  
      
    };




    //DELETE ARTISTA
    const deleteArtista = async(req,res) => {
    try{
        
        //Cogemos el id usuario de la URL
        const id_usuario = req.params.id_usuario;

        //LLamamos a la funcion deleteArtista de model
        const resultado = await artistaModel.deleteArtista(id_usuario)

        //Enviamos el artista eliminado
        res.json(resultado);

    }catch(error){

        //Mostramos error por consola
        console.error(error);

        //Enviamos al cliente
        res.status(500).json({

            error:"Error al borrar el artista"
        });

  }  

};


//EXPORTAMOS LAS FUNCIONES PARA PODER USARLAS DESDE LAS RUTAS
module.exports={

    getArtistas,
    getArtistaById,
    createArtista,
    updateArtista,
    deleteArtista
    
};
