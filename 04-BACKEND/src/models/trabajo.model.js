

//1.======Importamos  la conexión con la base de datos  PostgreSQL======
const pool = require("../db/connection");




//2.======Obtener todos los trabajos======
const getTrabajos = async () => {

    const result = await pool.query(

        "SELECT * FROM  trabajo"
     
    );
    
    return result.rows;

};


//3.======Obtener trabajo por su id======
const getTrabajoById = async(id_trabajo) => {

    const result  = await pool.query(

        "SELECT * FROM trabajo WHERE id_trabajo=$1",
        [id_trabajo]
    );

    return result.rows[0];
};


//4.======Crear un trabajo======
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




//5.======Actualizar trabajo======
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


//6.Eliminar un trabajo
const deleteTrabajo = async(id_trabajo) => {

    const result = await pool.query(

        "DELETE FROM trabajo WHERE id_trabajo = $1 RETURNING *",
        

            [id_trabajo]



        
    );

    return result.rows[0];

    
};


//7.Exportar módulos
module.exports={

    getTrabajos,
    getTrabajoById,
    createTrabajo,
    updateTrabajo,
    deleteTrabajo

};



