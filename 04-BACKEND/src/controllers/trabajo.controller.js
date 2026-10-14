
//1.======IMPORTAMOS TRABAJO DE MODEL======
const trabajoModel = require("../models/trabajo.model");




//.=====FUNCIÓN PARA OBTENER LOS TRABAJOS=====/
const getTrabajos = async(req,res)=>{


    try{

        //*Llamamos a la funcion getTrabajos del modelo
        //*Await espera a que postgre nos devuelva los trabajos

        const resultado = await trabajoModel.getTrabajos();
        res.json(resultado);



    }catch(error){

        //Si ocurre algún error lo mostramos por consola
        console.error(error);

        //Enviamos al cliente codigo httpp 500 que significa que ha ocurrido un error en el servidor
        res.status(500).json({

            //Mensaje que recibirá el cliente
            error: "Error al obtener los trabajos",

        });
   }

};





//=====FUNCION CREATE TRABAJO======/
const createTrabajo = async (req,res) =>{

    //Llamamos a la funcion crearTrabajo del modelo

    try{

        const {id_artista, titulo, descripcion, imagen } = req.body;

        
      //Comprobamos que un artista solo cree trabajos a su nombre

    if (

    req.usuario.rol !== "admin" &&
    Number(id_artista) !== Number(req.usuario.id_usuario)


   ) {

    return res.status(403).json({

        error: "No puedes crear trabajos a nombre de otro artista"

    });

}


        //Llamamos a la funcion createTrabajo del modelo
        const resultado = await trabajoModel.createTrabajo(

            id_artista,
            titulo,
            descripcion,
            imagen
    );

    //Enviamos el trabajo creado como respuesta
    res.status(201).json(resultado);


    }catch(error){

        //Mostramos un mensaje por consola
        console.error("Ha ocurrido un error");


        //Mostramos el error al cliente
        res.status(500).json({

            error: "Error al crear trabajo"

    });

    }
};




//======TENER TRABAJO POR SU ID ======
const getTrabajoById = async(req,res) => {

    try{

        //Recogemos el id_trabajo que nos aparece en la URL
        const {id_trabajo} = req.params;


        //Llamamos a la funcion getTrabajoById del modelo
        const resultado = await trabajoModel.getTrabajoById(id_trabajo);


        //Si no existe ese trabajo mostramos un error 404
        if (!resultado) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }


        //Enviamos el trabajo encontrado como respuesta
        res.json(resultado);


    }catch(error){

        //Mostramos el error por consola
        console.log("Ha ocurrido un error");

        //Mostramos un mensaje al cliente
        res.status(500).json({

            error:"Error al obtener el trabajo"


        });
    }
};





//=====ACTUALIZAR TRABAJO======/
const updateTrabajo= async(req,res) => {


    try{

        //Recogemos el id_trabajo que queremos actualizar
        const {id_trabajo} = req.params;


        //Buscamos el trabajo que queremos actualizar en postGreSQL
        const trabajo = await trabajoModel.getTrabajoById(id_trabajo);


       /*Comprobamos si ese trabajo existe*/
        if(!trabajo){

            return res.status(404).json({

                error: "Trabajo no encontrado"

            });

        }

        /*Comprobamos si el usario es el propietario o el administrador*/

        if(

            Number(trabajo.id_artista) !== Number(req.usuario.id_usuario) &&
           req.usuario.rol !== "admin"

        ){

            return res.status(403).json({

                error: "No tienes permiso para modificar este trabajo"

            });

        }


        //Cogemos los nuevos datos
        const {id_artista, titulo, descripcion, imagen} = req.body;


        //Impedimos que el artista cambie el propietario del trabajo
        if(

            req.usuario.rol !== "admin" &&

            Number(id_artista) !== Number(trabajo.id_artista)

      ){


        return res.status(403).json({

            error: "No puedes cambiar el propietario de este trabajo"

        });


      }



        //Mandamos los datos al modelo para actualizar trabajo
        const resultado = await trabajoModel.updateTrabajo(

            id_trabajo,
            id_artista,
            titulo,
            descripcion,
            imagen
       );

       if (!resultado) {

    return res.status(404).json({

        error: "Trabajo no encontrado"

       });

    }

       //Enviamos el trabajo actualizado al cliente

       res.json(resultado);


   }catch(error){

    //Mostramos un error en la consola
    console.error("Se ha producido un error");

    //Mostramos un error al cliente

    res.status(500).json("Se ha producido un error al actualizar el trabajo");

    }


};




//======FUNCIÓN PARA ELIMINAR EL TRABAJO=====
const deleteTrabajo = async (req, res) => {

    try {

        //Recogemos el id_trabajo que queremos eliminar
        const { id_trabajo } = req.params;


        //Buscamos el trabajo antes de eliminarlo
        const trabajo = await trabajoModel.getTrabajoById(id_trabajo);


        //Comprobamos si existe

       if(!trabajo) {

        return res.status(404).json({

            error: "Trabajo no encontrado"

         });


       }

       //Comprobamos si el usuario es dueño del trabajo o el administrador

       if(

        Number(trabajo.id_artista) !== Number(req.usuario.id_usuario) &&

        req.usuario.rol !== "admin"

       ){

        return res.status(403).json({

            error: "No tienes permiso para eliminar este trabajo"

        });


       }



        //Llamamos a la función deleteTrabajo del modelo
        const resultado = await trabajoModel.deleteTrabajo(id_trabajo);

        //Si el trabajo no existe mostramos un error 404
        if (!resultado) {

            return res.status(404).json({
                error: "Trabajo no encontrado"
            });

        }


        //Enviamos el trabajo eliminado al cliente
        res.json(resultado);

        
    } catch (error) {

        //Mostramos el error por consola
        console.error(error);

        //Enviamos un error al cliente
        res.status(500).json({
            error: "Error al eliminar el trabajo"
        });
    }
};






//======EXPORTAMOS LAS FUNCIONES======
module.exports = {

   getTrabajos,
   getTrabajoById,
   createTrabajo,
   updateTrabajo,
   deleteTrabajo  

};


