
/*----Importamos la conexión con nuestra base de datos PostgreSQL----*/
const pool = require("../db/connection");


//========OBTENER TODOS LOS ARTISTAS========//
const getArtistas = async () => {

    
    /*----Obtenemos los artistas junto con sus nombres e imágenes----*/
    const result = await pool.query(

        `SELECT
            artista.id_usuario,
            usuario.nombre,
            artista.especialidad,
            artista.descripcion,
            artista.descripcion_larga,
            artista.imagen,
            artista.imagen_tarjeta
        FROM artista
        INNER JOIN usuario
        ON artista.id_usuario = usuario.id_usuario`

    );

   

return result.rows;

};




//=======OBTENER ARTISTA POR ID=======//
const getArtistaById = async (id_usuario) => {


    /*----Buscamos un artista utilizando su ID de usuario----*/
    const result = await pool.query(

        "SELECT * FROM artista WHERE id_usuario = $1",
        [id_usuario]

    );

    return result.rows[0];

};



//=======CREAR ARTISTA=======//

/*----Guardamos el perfil profesional de un artista asociado a su usuario----*/
const createArtista = async (id_usuario, especialidad, descripcion) => {

    /*----Guardamos el perfil profesional del artista asociado a su cuenta de usuario----*/
    const result = await pool.query(

        "INSERT INTO artista (id_usuario,especialidad,descripcion) VALUES ($1,$2,$3) RETURNING * ",


        [
            id_usuario,
            especialidad,
            descripcion
        ]
    );

    return result.rows[0];
};




//=======ACTUALIZAR ARTISTA=======//

/*----Actualizamos la especialidad y la descripción de un artista----*/
const updateArtista = async (id_usuario, artista) => {


    /*----Actualizamos la especialidad y la descripción del artista indicado----*/
    const result = await pool.query(

        "UPDATE artista SET especialidad =$1,descripcion = $2 WHERE id_usuario= $3 RETURNING *",

        [

            artista.especialidad,
            artista.descripcion,
            id_usuario

        ]

    );

    return result.rows[0];

};



//=======ELIMINAR ARTISTA=======//

const deleteArtista = async (id_usuario) => {


    /*----Eliminamos el perfil del artista que corresponda al ID recibido----*/
    const result = await pool.query(

        "DELETE FROM artista WHERE id_usuario = $1  RETURNING *",
        [
            id_usuario

        ]

    );

    return result.rows[0];

};




//=======OBTENER SERVICIOS DE UN ARTISTA=======//

/*----Consultamos los servicios asociados a un artista----*/
const getServiciosByArtista = async (id_artista) => {

    const result = await pool.query(

        `SELECT servicio.*
         FROM servicio
         INNER JOIN artista_servicio
         ON servicio.id_servicio = artista_servicio.id_servicio
         WHERE artista_servicio.id_artista = $1
         ORDER BY servicio.id_servicio`,

        [id_artista]

    );

    return result.rows;

};


//=======EXPORTAR FUNCIONES=======//

module.exports = {

    getArtistas,
    getArtistaById,
    createArtista,
    updateArtista,
    deleteArtista,
    getServiciosByArtista

};














