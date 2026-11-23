
/*----Importamos la conexión con la base de datos PostgreSQL----*/
const pool = require("../db/connection");


//=======OBTENER TODAS LAS CITAS=======//

const getCitas = async () => {

    const resultado = await pool.query(`

        SELECT
            cita.*,
            TO_CHAR(cita.fecha, 'YYYY-MM-DD') AS fecha,
            CONCAT(cliente.nombre, ' ', cliente.apellidos) AS nombre_cliente,
            usuario.nombre AS nombre_artista,
            servicio.nombre AS nombre_servicio
        FROM cita
        LEFT JOIN cliente
            ON cita.id_cliente = cliente.id_cliente
        LEFT JOIN artista
            ON cita.id_artista = artista.id_usuario
        LEFT JOIN usuario
            ON artista.id_usuario = usuario.id_usuario
        LEFT JOIN servicio
            ON cita.id_servicio = servicio.id_servicio
        ORDER BY cita.fecha ASC, cita.hora ASC

    `);

    return resultado.rows;

};


//=======OBTENER LAS CITAS DE UN CLIENTE=======//

/*----Buscamos las citas asociadas a un usuario que tiene perfil de cliente----*/
const getCitasByCliente = async (id_usuario) => {

    const resultado = await pool.query(

        `SELECT
            cita.*,
            TO_CHAR(cita.fecha, 'YYYY-MM-DD') AS fecha
         FROM cita
         INNER JOIN cliente
             ON cita.id_cliente = cliente.id_cliente
         WHERE cliente.id_usuario = $1
         ORDER BY cita.fecha ASC, cita.hora ASC`,

        [id_usuario]

    );

    /*----Devolvemos las citas del cliente----*/
    return resultado.rows;

};


//=======OBTENER LAS CITAS DE UN ARTISTA=======//

/*----Buscamos las citas asignadas a un artista mediante su ID de usuario----*/
const getCitasByArtista = async (id_usuario) => {

    const resultado = await pool.query(

        `SELECT
            cita.*,
            TO_CHAR(cita.fecha, 'YYYY-MM-DD') AS fecha
         FROM cita
         WHERE id_artista = $1
         ORDER BY cita.fecha ASC, cita.hora ASC`,

        [id_usuario]

    );

    return resultado.rows;

};


//=======OBTENER CITA POR ID=======//

/*----Buscamos una cita utilizando su identificador----*/
const getCitaById = async (id_cita) => {

    const resultado = await pool.query(

        `SELECT
            cita.*,
            TO_CHAR(cita.fecha, 'YYYY-MM-DD') AS fecha
         FROM cita
         WHERE id_cita = $1`,

        [id_cita]

    );

    /*----Devolvemos la cita encontrada o undefined si no existe----*/
    return resultado.rows[0];

};


//=======CREAR CITA=======//

/*----Registramos una nueva cita con su duración en minutos----*/
const createCita = async (
    id_cliente,
    id_artista,
    id_servicio,
    fecha,
    hora,
    estado,
    duracion_minutos
) => {

    const resultado = await pool.query(

        `INSERT INTO cita
        (
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            *,
            TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha`,

        [
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos
        ]

    );

    /*----Devolvemos la cita que acabamos de crear----*/
    return resultado.rows[0];

};


//=======ACTUALIZAR CITA=======//

/*----Modificamos los datos de una cita existente----*/
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
         RETURNING
            *,
            TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha`,

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

    /*----Devolvemos la cita actualizada o undefined si no existe----*/
    return resultado.rows[0];

};


//=======ELIMINAR CITA=======//

/*----Eliminamos una cita utilizando su identificador----*/
const deleteCita = async (id_cita) => {

    const resultado = await pool.query(

        "DELETE FROM cita WHERE id_cita = $1 RETURNING *",

        [id_cita]

    );

    /*----Devolvemos la cita eliminada o undefined si no existe----*/
    return resultado.rows[0];

};


//=======COMPROBAR SOLAPAMIENTO DE CITAS=======//

/*----Comprobamos si un artista tiene otra cita confirmada en el mismo horario----*/
const comprobarSolapamiento = async (
    id_artista,
    fecha,
    hora,
    duracion_minutos,
    id_cita = null
) => {

    const resultado = await pool.query(

        `SELECT id_cita
         FROM cita
         WHERE id_artista = $1
         AND fecha = $2
         AND estado = 'confirmada'
         AND duracion_minutos IS NOT NULL
         AND ($5::integer IS NULL OR id_cita <> $5)
         AND hora < (
             $3::time + $4::integer * INTERVAL '1 minute'
         )
         AND (
             hora + duracion_minutos * INTERVAL '1 minute'
         ) > $3::time
         LIMIT 1`,

        [
            id_artista,
            fecha,
            hora,
            duracion_minutos,
            id_cita
        ]

    );

    /*----Devolvemos true si existe un solapamiento y false si el horario está libre----*/
    return resultado.rows.length > 0;

};


//=======OBTENER CITAS OCUPADAS DE UN ARTISTA=======//

/*----Consultamos los horarios confirmados de un artista en una fecha concreta----*/
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

        [
            id_artista,
            fecha
        ]

    );

    /*----Devolvemos los horarios ocupados del artista----*/
    return resultado.rows;

};


//=======COMPROBAR SI EL ARTISTA OFRECE EL SERVICIO=======//

/*----Comprobamos si el servicio solicitado está asociado al artista----*/
const artistaOfreceServicio = async (id_artista, id_servicio) => {

    const resultado = await pool.query(

        `SELECT 1
         FROM artista_servicio
         WHERE id_artista = $1
         AND id_servicio = $2
         LIMIT 1`,

        [id_artista, id_servicio]

    );

    /*----Devolvemos true si el artista ofrece el servicio y false si no lo ofrece----*/
    return resultado.rows.length > 0;

};


//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en el controlador de citas----*/

module.exports = {
    getCitas,
    getCitasByCliente,
    getCitasByArtista,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    comprobarSolapamiento,
    getCitasOcupadas,
    artistaOfreceServicio
};
