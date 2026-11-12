
const pool = require("../db/connection");



/*----Importamos bcrypt para proteger las contraseñas de los usuarios----*/
const bcrypt = require("bcrypt");





//========OBTENEMOS TODOS LOS USUARIOS=======//
const getUsers = () => {

    /*----Consultamos los usuarios sin devolver sus contraseñas----*/
    return pool.query('SELECT id_usuario,nombre,email, rol FROM usuario');


};




//========CREAR UN USUARIO=======//


const createUser = async (nombre, email, contrasena, rol) => {

    /*----Convertimos la contraseña en un hash antes de guardarla en la base de datos----*/
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    /*----Guardamos el nuevo usuario y devolvemos sus datos sin incluir la contraseña----*/
    return pool.query(

        `INSERT INTO usuario (nombre,email,contrasena, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario, nombre, email, rol`,

        [nombre, email, contrasenaHash, rol]

    );

};


//======OBTENER UN USUARIO POR ID========//



const getUserById = (id_usuario) => {

    /*----Buscamos un usuario por su ID sin devolver su contraseña----*/
    return pool.query(

        `SELECT id_usuario, nombre, email, rol
         FROM usuario
         WHERE id_usuario = $1`,

        [id_usuario]

    );

};



//======ACTUALIZAR UN USUARIO======//

const updateUser = async (id_usuario, nombre, email, contrasena, rol) => {

    /*----Protegemos la nueva contraseña antes de actualizar los datos del usuario----*/
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    /*----Actualizamos los datos del usuario que corresponda al ID recibido----*/
    const result = await pool.query(


        `UPDATE usuario
         SET nombre=$1, 
             email=$2,
             contrasena=$3,
             rol=$4
         WHERE id_usuario = $5
         RETURNING id_usuario, nombre, email, rol`,

        [nombre, email, contrasenaHash, rol, id_usuario]

    );

    return result;

};




//======ELIMINAR USUARIO======//

const deleteUser = async (id) => {

    /*----Eliminamos de la base de datos el usuario que tenga el ID indicado----*/
    const resultado = await pool.query(

        'DELETE  FROM usuario WHERE id_usuario = $1',
        [id]

    );

    return resultado;

};




//======BUSCAR USUARIO POR EMAIL PARA ======//

const getUserByEmail = async (email) => {

    /*----Buscamos el usuario por su correo para comprobar sus datos durante el inicio de sesión----*/
    const result = await pool.query(

        'SELECT * FROM usuario WHERE email = $1',

        [email]

    );

    return result.rows[0];

};



//=====CAMBIAR LA CONTRASEÑA DE UN USUARIO=====//

const cambiarContrasena = async (id_usuario, nuevaContrasena) => {

    /*----Convertimos la nueva contraseña en un hash para guardarla de forma segura----*/
    const contrasenaHash = await bcrypt.hash(nuevaContrasena, 10);

    /*----Actualizamos únicamente la contraseña del usuario indicado----*/
    const resultado = await pool.query(

        `UPDATE usuario
         SET contrasena = $1
         WHERE id_usuario = $2
         RETURNING id_usuario, nombre, email, rol`,

        [contrasenaHash, id_usuario]

    );

    return resultado.rows[0];

};



//=======EXPORTAMOS LAS FUNCIONES======//

module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    cambiarContrasena

};



