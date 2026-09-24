

//Importamos artista model
const artistaModel =require("../models/artista.model");





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


    try{

        //Cogemos los datos que nos envian
        const { id_usuario, especialidad, descripcion} = req.body;

        //LLamamos a la funcion createArtista del modelo.
        const resultado = await artistaModel.createArtista(

            
            id_usuario,
            especialidad,
            descripcion
    
        );

        //Enviamos el artista creado como respuesta
        res.status(201).json(resultado);


        
    }catch(error){

        //Si ocurre algún error lo mostramos por consola
        console.error(error);

        //Enviamos al cliente codigo http 500
        res.status(500).json({

            error: "Error al crear un artista"

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
