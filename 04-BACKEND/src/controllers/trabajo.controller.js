
//1.Importamos trabajo de model
const trabajoModel = require("../models/trabajo.model");


//2.Esta funcion se ejecuta cuando recibimos una petición para obtener los resultados de los trabajos

const getTrabajos = async(req,res)=>{


    try{

        //*Llamamos a la funcion getTrabajos del modelo
        //*Await espera a que postgre nos devuelva los gastos

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








//3.Esta función ejecuta crearTrabajo
const createTrabajo = async (req,res) =>{

    //Llamamos a la funcion crearTrabajo del modelo

    try{

        const { id_trabajo,id_artista,titulo,descripcion } = req.body;

        //Llamamos a la funcion createTrabajo del modelo

        const resultado = await trabajoModel.createTrabajo(

            id_trabajo,
            id_artista,
            titulo,
            descripcion
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




//Aquí seria la opción de obtener un trabajo por su id
const getTrabajoById = async(req,res) => {

    try{

        //Recogemos el id_trabajo que nos aparece en la URL
        const {id_trabajo} = req.params;


        //Llamamos a la funcion getTrabajoById del modelo
        const resultado = await trabajoModel.getTrabajoById(id_trabajo);


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




//Aquí sería la función de actualizar un trabajo
const updateTrabajo= async(req,res) => {


    try{

        //Recogemos el id_trabajo que queremos modificar
        const {id_trabajo} = req.params;

        //Cogemos los nuevos datos
        const {id_artista,titulo,descripcion} = req.body;

        //Mandamos los datos al modelo para actualizar trabajo

        const resultado = await trabajoModel.updateTrabajo(

            id_trabajo,
            id_artista,
            titulo,
            descripcion
       );

       //Enviamos el trabajo actualizado al cliente

       res.json(resultado);


   }catch(error){

    //Mostramos un error en la consola
    console.error("Se ha producido un error");

    //Mostramos un error al cliente

    res.status(500).json("Se ha producido un error al actualizar el trabajo");

    }


}

//FUNCIÓN PARA ELIMINAR EL TRABAJO

const deleteTrabajo = async (req, res) => {

    try {

        //Recogemos el id_trabajo que queremos eliminar
        const { id_trabajo } = req.params;

        //Llamamos a la función deleteTrabajo del modelo
        const resultado = await trabajoModel.deleteTrabajo(id_trabajo);

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


