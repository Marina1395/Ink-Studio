
/*----Importamos la conexión con la base de datos PostgreSQL----*/
const pool = require("../db/connection");





//=======OBTENER TODOS LOS MENSAJES=======//

/*----Obtenemos todos los mensajes registrados en la base de datos----*/
const getMensajes = async () => {

    const result = await pool.query("SELECT * FROM mensaje");
    return result.rows;
}




//=======OBTENER MENSAJE POR ID=======//

/*----Buscamos un mensaje utilizando su identificador----*/
const getMensajeById = async (id_mensaje) => {

    const result = await pool.query(

        "SELECT * FROM mensaje WHERE id_mensaje = $1",

        [id_mensaje]

    );

    return result.rows[0];

};


//=======CREAR MENSAJE=======//

/*----Registramos un nuevo mensaje en la base de datos----*/

const createMensaje = async (nombre, email, asunto, mensaje) => {

    const result = await pool.query(
        "INSERT INTO mensaje (nombre, email, asunto, mensaje) VALUES ($1, $2, $3, $4) RETURNING *",

        [nombre, email, asunto, mensaje]

    );

    return result.rows[0];

};


//=======ACTUALIZAR MENSAJE=======//

/*----Modificamos los datos de un mensaje existente----*/
const updateMensaje = async (id_mensaje, nombre, email, asunto, mensaje) => {

    const result = await pool.query(

        "UPDATE mensaje SET nombre = $1, email = $2, asunto = $3, mensaje = $4 WHERE id_mensaje = $5 RETURNING *",

        [nombre, email, asunto, mensaje, id_mensaje]

    );

    return result.rows[0];

};




//=======ELIMINAR MENSAJE=======//

/*----Eliminamos un mensaje utilizando su identificador----*/
const deleteMensaje = async (id_mensaje) => {

    const result = await pool.query(

        "DELETE FROM mensaje WHERE id_mensaje = $1 RETURNING *",
        [id_mensaje]

    );

    return result.rows[0];

};

//=======EXPORTAR FUNCIONES=======//

module.exports={

    getMensajes,
    getMensajeById,
    createMensaje,
    updateMensaje,
    deleteMensaje

};





