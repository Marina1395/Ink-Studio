
//1.====IMPORTAMOS LA CONEXION CON POSTGRESQL====
const pool = require("../db/connection");


//2.=====OBTENER TODOS LOS SERVICIOS=====//
/*Con esto creamos una funcion que el diga a postgre que obtenga todos los servcios y devuelva el resultado*/
const getServicios = async() =>{

   const result = await pool.query(

    " SELECT * FROM servicio "
   );

   return result.rows;
 };






//3.=====OBTENER TODOS LOS SERVICIOS POR SU ID=====
const getServicioById = async(id_servicio) => {

    const result = await pool.query(

        "SELECT * FROM servicio WHERE id_servicio = $1",
        [id_servicio]
    );

    return result.rows[0];

};



//4.=====AHORA VAMOS A CREAR UN SERVICIO=====
const createServicio = async (nombre,descripcion,precio) => {

    const result  = await pool.query(

        "INSERT INTO servicio (nombre, descripcion, precio) VALUES ($1,$2,$3) RETURNING *",
        [
            
            nombre,
            descripcion,
            precio
        ] 
    );
    
      return result.rows[0]

};





//5.=====AHORA VAMOS A ACTUALIZAR SERVICIO=====//
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




//6.=====DELETE SERVICIO======//

const deleteServicio = async(id_servicio)=>{

    const result = await pool.query(

    "DELETE  FROM servicio  WHERE id_servicio = $1 RETURNING *",
    [id_servicio]

    );

    return result.rows[0];

}


//7.EXPORTACIÓN DE MÓDULOS

module.exports = {

    getServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio

};












