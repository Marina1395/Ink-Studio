//1.======IMPORTAR MODEL CITA======/
const citaModel = require("../models/cita.model");




//2.======OBTENER CITAS======/
const getCitas = async(req, res) => {

    try {

        //* Llamamos a la función getCitas del Model
        const resultado = await citaModel.getCitas();

        //* Enviamos las citas obtenidas
        res.json(resultado);

    } catch(error) {

        console.error(error);

        //* Si ocurre un error en el servidor, mostramos un error 500
        res.status(500).json({

            error: "Ha ocurrido un error al obtener las citas"

        });

    }

};



//3.=====OBTENER CITA POR SU ID======/
const getCitaById = async ( req, res) => {

    try{

        const { id_cita } = req.params;

        const resultado = await citaModel.getCitaById(id_cita);

        if(!resultado){

            return res.status(404).json({

                error:"Cita no encontrada"

            });
        }

        res.json(resultado);

        
    }catch(error){


        //*Mensaje que recibimos nosotros en el servidor de la consola
        console.error(error);

        //Codigo http 500 que enviamos al cliente para mostrar el error,

        res.status(500).json("Ha habido un error al obtener la cita por su id");

    }

};




//3.=====CREAR CITAS=====/
const createCita = async( req, res) => {

    try{

    const {

        id_cliente,
        id_artista,
        id_servicio,
        fecha,
        hora,
        estado

    }=req.body;

    const resultado = await citaModel.createCita(

        id_cliente,
        id_artista,
        id_servicio,
        fecha,
        hora,
        estado

    )

    res.status(201).json(resultado)


}catch(error){

    //*Mensaje que aparece en la consola del servidor
    console.error(error);

    //*Codigo http 500 que le aparece al cliente

    res.status(500).json({

       error: "Ha ocurrido un error al crear la nueva cita",

    })    

   }  

};



//4.======UPDATE CITA======/
const updateCita = async(req, res) => {

    try {

        // Obtenemos el ID de la cita desde la URL
        const { id_cita } = req.params;

        // Obtenemos los nuevos datos de la cita
        const {
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado
        } = req.body;

        // Llamamos al model para actualizar la cita
        const resultado = await citaModel.updateCita(
            id_cita,
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado
        );

        // Si no existe la cita
        if (!resultado) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        // Enviamos la cita actualizada
        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al actualizar la cita"
        });

    }

};



//5.=====DELETE CITAS=====/
//5.=====DELETE CITA=====/
const deleteCita = async(req, res) => {

    try {

        // Obtenemos el ID de la cita desde la URL
        const { id_cita } = req.params;

        // Llamamos al model para eliminar la cita
        const resultado = await citaModel.deleteCita(id_cita);

        // Si la cita no existe
        if (!resultado) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        // Enviamos la cita que hemos eliminado
        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al eliminar la cita"
        });

    }

};


//6-=====EXPORTAR MODULOS=====

module.exports = {

    getCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita

};
    
        
    




     
















