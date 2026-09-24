// Aquí trabajaremos con los datos de los usuarios.


const pool = require("../db/connection");

const getUsers = () =>  {

    return pool.query('SELECT*FROM usuario');

};




//=====CREAR UN USUARIO=======
//Esta función sirve para crear un nuevo usuario dentro de la tabla usuario

const createUser = (nombre,email,contrasena,rol) =>{


    //INSERT SIRVE PARA INTRODUCIR UN NUEVO REGISTRO EN LA TABLA USUARIO

    //$1,$2,$3 y $4 SON ESPACIOS RESERVADOS PARA LOS DATOS QUE RECIBIMOS, QUE SON: nombre,email,contraseña y rol

    // RETURNING * hace que PostgreSQL nos devuelva el usuario que acabamos de crear.

    return pool.query(

        'INSERT INTO usuario (nombre,email,contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING*',

        [nombre, email, contrasena, rol]

    );

};


//======OBTENER UN USUARIO POR ID ======

//Esta función sirve para obtener un usuario concreto mediante su id_usuario
const getUserById = (id_usuario) => {

    return pool.query(

        'SELECT * FROM usuario WHERE id_usuario = $1',
        [id_usuario]
    );

};


//======ACTUALIZAR UN USUARIO======//

const updateUser =(id_usuario,nombre,email,contrasena,rol) =>{

    return pool.query(

        'UPDATE usuario SET nombre=$1, email=$2, contrasena=$3, rol=$4 WHERE id_usuario = $5 RETURNING *',

        [nombre, email, contrasena, rol ,id_usuario]

    );

};

//======ELIMINAR USUARIO======//

const deleteUser = async (id) => {

    const resultado = await pool.query(

        'DELETE  FROM usuario WHERE id_usuario = $1',
        [id]
 );

 return resultado;

};





//EXPORTAMOS LAS FUNCIONES PARA PODER UTILIZARLAS DESDE EL CONTROLLER



module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
    
};



