// Aquí trabajaremos con los datos de los usuarios.
const pool = require("../db/connection");



//IMPORTAMOS BCRYPT PARA TRABAJAR DE FORMA SEGURA CON LAS CONTRASEÑAS
const bcrypt = require("bcrypt");

const getUsers = () =>  {

    return pool.query('SELECT id_usuario,nombre,email, rol FROM usuario');


};




//=====CREAR UN USUARIO=======//
const createUser = async (nombre,email,contrasena,rol) =>{

    /*Crearemos el hash*/
    const contrasenaHash = await bcrypt.hash(contrasena,10);



    return pool.query(

        'INSERT INTO usuario (nombre,email,contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre, email, rol',

        [nombre, email, contrasenaHash, rol]

    );

};


//======OBTENER UN USUARIO POR ID ======

//Esta función sirve para obtener un usuario concreto mediante su id_usuario
const getUserById = (id_usuario) => {

    return pool.query(

        'SELECT * FROM usuario WHERE id_usuario,nombre, email, rol FROM usuario WHERE id_usuario = $1',
        [id_usuario]
    );

};


//======ACTUALIZAR UN USUARIO======//

const updateUser = async (id_usuario,nombre,email,contrasena,rol) =>{

    //Hasheamos la contraseña antes de guardarla
    const contrasenaHash = await bcrypt.hash(contrasena,10);

    const result = await pool.query(


        `UPDATE usuario SET nombre=$1, email=$2, contrasena=$3, rol=$4
         WHERE id_usuario = $5
         RETURNING id_usuario, nombre, email, rol`,

        [nombre, email, contrasenaHash, rol ,id_usuario]

    );

    return result;

};

//======ELIMINAR USUARIO======//

const deleteUser = async (id) => {

    const resultado = await pool.query(

        'DELETE  FROM usuario WHERE id_usuario = $1',
        [id]

 );

 return resultado;

};


//======BUSCAR USUARIO POR EMAIL PARA LOGIN======//

const getUserByEmail = async (email) => {

    const result = await pool.query(
        'SELECT * FROM usuario WHERE email = $1',
        [email]
    );

    return result.rows[0];

};



//EXPORTAMOS LAS FUNCIONES PARA PODER UTILIZARLAS DESDE EL CONTROLLER

module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail
    
};



