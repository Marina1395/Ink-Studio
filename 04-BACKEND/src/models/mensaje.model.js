
//1.======IMPORTAR CONEXIÓN CON BASE DE DATOS=====//
const pool = require("../db/connection");


//2.======CREAMOS FUNCIONES======//
/*Obtener todos los mensajes*/
const getMensajes = async () => {

    const result = await pool.query("SELECT * FROM mensaje");
    return result.rows;
}


/* Obtener mensaje por ID */
const getMensajeById = async (id_mensaje) => {

    const result = await pool.query(
        "SELECT * FROM mensaje WHERE id_mensaje = $1",
        [id_mensaje]
    );

    return result.rows[0];

};


/*Crear mensaje*/
const createMensaje = async (nombre, email, asunto, mensaje) => {

    const result = await pool.query(
        "INSERT INTO mensaje (nombre, email, asunto, mensaje) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, email, asunto, mensaje]
    );

    return result.rows[0];

};


/* Actualizar mensajes */
const updateMensaje = async (id_mensaje, nombre, email, asunto, mensaje) => {

    const result = await pool.query(

        "UPDATE mensaje SET nombre = $1, email = $2, asunto = $3, mensaje = $4 WHERE id_mensaje = $5 RETURNING *",
        [nombre, email, asunto, mensaje, id_mensaje]

    );

    return result.rows[0];

};

/*Eliminar mensaje*/
const deleteMensaje = async (id_mensaje) => {

    const result = await pool.query(
        "DELETE FROM mensaje WHERE id_mensaje = $1 RETURNING *",
        [id_mensaje]
    );

    return result.rows[0];

};


//3.======EXPORTAMOS LAS FUNCIONES======//
module.exports={

    getMensajes,
    getMensajeById,
    createMensaje,
    updateMensaje,
    deleteMensaje

};





