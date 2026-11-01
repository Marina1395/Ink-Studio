
/*----Importamos la conexión con la base de datos PostgreSQL----*/
const pool = require("../db/connection");


//=======OBTENER TODOS LOS SERVICIOS=======//

/*----Obtenemos todos los servicios registrados en la base de datos----*/
const getServicios = async() =>{

   const result = await pool.query(

    " SELECT * FROM servicio "
   );

   return result.rows;

 };






//=======OBTENER SERVICIO POR ID=======//

/*----Buscamos un servicio utilizando su identificador----*/
const getServicioById = async(id_servicio) => {

    const result = await pool.query(

        "SELECT * FROM servicio WHERE id_servicio = $1",

        [id_servicio]
    );

    return result.rows[0];

};



//=======CREAR SERVICIO=======//

/*----Registramos un nuevo servicio en la base de datos----*/
const createServicio = async (nombre,descripcion,precio) => {

    const result  = await pool.query(

        "INSERT INTO servicio (nombre, descripcion, precio) VALUES ($1,$2,$3) RETURNING *",
        [
            
            nombre,
            descripcion,
            precio
        ] 
    );
    
      return result.rows[0];

};





//=======ACTUALIZAR SERVICIO=======//

/*----Modificamos los datos de un servicio existente----*/

const updateServicio = async (id_servicio, nombre, descripcion, precio)=>{

    const result = await pool.query(

        "UPDATE servicio SET nombre = $1, descripcion = $2, precio = $3 WHERE id_servicio = $4 RETURNING *",

        [

            nombre,
            descripcion,
            precio,
            id_servicio
        ]

    );


    return result.rows[0];

};




//=======ELIMINAR SERVICIO=======//

/*----Eliminamos un servicio utilizando su identificador----*/

const deleteServicio = async(id_servicio)=>{

    const result = await pool.query(

    "DELETE  FROM servicio  WHERE id_servicio = $1 RETURNING *",
    [id_servicio]

    );

    return result.rows[0];

}



//=======EXPORTAR FUNCIONES======//

module.exports = {

    getServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio

};












