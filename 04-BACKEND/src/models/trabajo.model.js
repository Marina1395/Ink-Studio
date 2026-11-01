

/*----Importamos la conexión con la base de datos PostgreSQL----*/
const pool = require("../db/connection");



//=======OBTENER TODOS LOS TRABAJOS=======//

/*----Obtenemos todos los trabajos registrados en la base de datos----*/
const getTrabajos = async () => {

    const result = await pool.query(

        "SELECT * FROM  trabajo"
     
    );
    
    return result.rows;

};




//=======OBTENEMOS LOS TRABAJOS POR SU ID=======//

/*----Buscamos un trabajo utilizando su identificador----*/
const getTrabajoById = async(id_trabajo) => {

    const result  = await pool.query(

        "SELECT * FROM trabajo WHERE id_trabajo=$1",
        [id_trabajo]
    );
    
    /*----Devolvemos el trabajo encontrado o undefined si no existe----*/
    return result.rows[0];

};




//=======CREAR UN TRABAJO=======//

/*----Registramos un nuevo trabajo asociado a un artista----*/
const createTrabajo = async(id_artista, titulo, descripcion, imagen) => {

    const result = await pool.query(

        "INSERT INTO trabajo(id_artista,titulo,descripcion,imagen) VALUES ($1,$2,$3,$4) RETURNING *",
    
    [

       
        id_artista,
        titulo,
        descripcion,
        imagen
    ]

);

  return result.rows[0];

}





//=======ACTUALIZAR TRABAJO=======//

/*----Modificamos los datos de un trabajo existente----*/
const updateTrabajo = async (id_trabajo, id_artista, titulo, descripcion, imagen) => {

    const result = await pool.query(

        "UPDATE trabajo SET id_artista=$1, titulo=$2, descripcion=$3, imagen=$4 WHERE id_trabajo=$5 RETURNING *",


    [
            id_artista,
            titulo,
            descripcion,
            imagen,
            id_trabajo
        ]

    );

    return result.rows[0];

};




//=======ELIMINAR TRABAJO=======//

/*----Eliminamos un trabajo utilizando su identificador----*/
const deleteTrabajo = async(id_trabajo) => {

    const result = await pool.query(

        "DELETE FROM trabajo WHERE id_trabajo = $1 RETURNING *",
        

            [id_trabajo]

        
    );

    return result.rows[0];

    
};




//=======EXPORTAR FUNCIONES======//

module.exports={

    getTrabajos,
    getTrabajoById,
    createTrabajo,
    updateTrabajo,
    deleteTrabajo

};



