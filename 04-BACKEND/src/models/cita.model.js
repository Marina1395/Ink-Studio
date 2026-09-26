
//1.======IMPORTAMOS LA CONEXIÓN CON LA BASE DE DATOS======/
const pool = require("../db/connection");



//2.=====OBTENEMOS CITAS DE LA BASE DE DATOS======/
const getCitas = async() => {

    const resultado = await pool.query(

        "SELECT * FROM cita",     
    );

    return resultado.rows;

};



//3.=====OBTENER CITAS POR SU ID======/
const getCitaById = async(id_cita) => {

    const resultado = await pool.query(

        "SELECT * FROM cita WHERE id_cita = $1",
        [id_cita]

    );

    return resultado.rows[0]
    
};




//4.=====CREAR CITA=====/
const createCita = async(id_cliente, id_artista, id_servicio, fecha, hora, estado) => {

    const resultado = await pool.query(

        "INSERT INTO cita (id_cliente, id_artista, id_servicio, fecha, hora, estado) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado
        ]
    );

    return resultado.rows[0];

};



//5.=====ACTUALIZAR CITA=======/
const updateCita = async(id_cita, id_cliente, id_artista, id_servicio, fecha, hora, estado) => { 

    const resultado = await pool.query(

        "UPDATE cita SET  id_cliente=$1, id_artista=$2, id_servicio=$3, fecha=$4, hora=$5, estado=$6 WHERE id_cita=$7 RETURNING *",

        [
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            id_cita
        ]

    );

    return resultado.rows[0];

};



//6.======ELIMINAR CITA======/
const deleteCita = async (id_cita)=>{

    const resultado = await pool.query(

        "DELETE FROM cita WHERE id_cita=$1 RETURNING *",
     [id_cita]

    );

    return resultado.rows[0];

};



//7.======EXPORTAR MODULOS=======
module.exports={

    getCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita
};
