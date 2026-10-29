
 //1.======IMPORTAMOS LA CONEXIÓN CON POSTGRESQL======//
const pool = require("../db/connection");


//2.======OBTENER TODAS LAS CITAS======//
const getCitas = async () => {

    const resultado = await pool.query(
        "SELECT * FROM cita ORDER BY fecha ASC, hora ASC"
    );

    return resultado.rows;

};


//3.======OBTENER UNA CITA POR SU ID======//
const getCitaById = async (id_cita) => {

    const resultado = await pool.query(

        "SELECT * FROM cita WHERE id_cita = $1",

        [id_cita]

    );

    return resultado.rows[0];

};


//4.======CREAR UNA CITA======//
const createCita = async (
    id_cliente,
    id_artista,
    id_servicio,
    fecha,
    hora,
    estado
) => {

    const resultado = await pool.query(

        `INSERT INTO cita
        (id_cliente, id_artista, id_servicio, fecha, hora, estado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,

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


//5.======ACTUALIZAR UNA CITA======//
const updateCita = async (
    id_cita,
    id_cliente,
    id_artista,
    id_servicio,
    fecha,
    hora,
    estado,
    duracion_minutos
) => {

    const resultado = await pool.query(

        `UPDATE cita
         SET
            id_cliente = $1,
            id_artista = $2,
            id_servicio = $3,
            fecha = $4,
            hora = $5,
            estado = $6,
            duracion_minutos = $7
         WHERE id_cita = $8
         RETURNING *`,

        [
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos,
            id_cita
        ]

    );

    return resultado.rows[0];

};


//6.======ELIMINAR UNA CITA======//
const deleteCita = async (id_cita) => {

    const resultado = await pool.query(

        "DELETE FROM cita WHERE id_cita = $1 RETURNING *",

        [id_cita]

    );

    return resultado.rows[0];

};


//7.======COMPROBAR SI DOS CITAS SE SOLAPAN======//
const comprobarSolapamiento = async (
    id_artista,
    fecha,
    hora,
    duracion_minutos,
    id_cita
) => {

    const resultado = await pool.query(

        `SELECT id_cita
         FROM cita
         WHERE id_artista = $1
         AND fecha = $2
         AND estado = 'confirmada'
         AND duracion_minutos IS NOT NULL
         AND id_cita <> $5
         AND hora < (
             $3::time + $4::integer * INTERVAL '1 minute'
         )
         AND (
             hora + duracion_minutos * INTERVAL '1 minute'
         ) > $3::time`,

        [
            id_artista,
            fecha,
            hora,
            duracion_minutos,
            id_cita
        ]

    );

    return resultado.rows.length > 0;

};


//8.======OBTENER CITAS OCUPADAS DE UN ARTISTA======//
const getCitasOcupadas = async (id_artista, fecha) => {

    const resultado = await pool.query(

        `SELECT
            id_cita,
            hora,
            duracion_minutos
         FROM cita
         WHERE id_artista = $1
         AND fecha = $2
         AND estado = 'confirmada'
         AND duracion_minutos IS NOT NULL
         ORDER BY hora ASC`,

        [id_artista, fecha]

    );

    return resultado.rows;

};


//9.======EXPORTAMOS TODAS LAS FUNCIONES======//
module.exports = {
    getCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    comprobarSolapamiento,
    getCitasOcupadas
};
