


const usuarioModel = require("../models/user.model");



const bcrypt = require("bcrypt");



//3-=====USAMOS LIBRERIA JSONWEBTOKEN EN CONTROLLER=====//
const jwt = require ("jsonwebtoken");




const getUsers = async (req,res) => {

    try{

    // Llamamos a la función getUsers() del modelo.
    // await espera a que PostgreSQL nos devuelva los datos.

    const resultado = await usuarioModel.getUsers();

    // resultado.rows contiene las filas que ha devuelto PostgreSQL.
        // res.json() envía esas filas al cliente en formato JSON.
        res.json(resultado.rows);

    } catch (error){

        // Si ocurre algún error, lo mostramos en la consola.
        console.error(error);

         // Enviamos al cliente el código HTTP 500,
        // que significa que ha ocurrido un error en el servidor.
        res.status(500).json({

            // Mensaje que recibirá el cliente.
            error: "Error al obtener los usuarios"

        });

    }

    };   




//AQUI VA LA NUEVA FUNCIÓN DE createUser

const createUser = async (req, res)=> {

    try{

        //Recogemos los datos que nos envia el usuario

        const{ nombre, email, contrasena, rol} = req.body;
        


        //LLamamos  a la funcion createUser del modelo

        const resultado = await usuarioModel.createUser(

            nombre,
            email,
            contrasena,
            rol
        );

        //Enviamos el usuario creado como respuesta

        res.status(201).json(resultado.rows[0]);


    }catch (error){

        //Si ocurre algun error, lo mostramos en la consola

        console.error(error);

        //Enviamos un error al cliente

        res.status(500).json({

            error: "Error al crear el usuario"

        });
    }
};
 

//======OBTENER UN USUARIO POR ID ======
//Esta función nos sirve para obtener un usuario concreto...
//...de la tabla usuario mediante id_usuario.

const getUserById = async (req, res) => {

    try {

        //Recogemos el id_usuario que viene en la URL.
        const { id_usuario } = req.params;

        //LLamamos a la función getUserById del modelo.
        const resultado = await usuarioModel.getUserById(id_usuario);

        //Enviamos el usuario encontrado como respuesta
        res.json(resultado.rows[0]);



    } catch(error){

        //Si ocurre algún error lo mostramos en la consola
        console.error(error);

        //Enviamos un error al cliente
        res.status(500).json({

            error: "Error al obtener el usuario"

        });
    } 
};




//=====ACTUALIZAR USUARIO======//
//Esta funcion sirve para actualizar los datos de un usuario...
//...recibe la peticion (req) y prepara la respuesta (res )

const updateUser = async (req, res) => {

   try{

        //Cogemos el id de la URL
        const { id_usuario } = req.params;

        //Cogemos los nuevos datos
        const { nombre, email, contrasena, rol } = req.body;

        //Mandamos los datos al modelo para actualizar el usuario
        const resultado = await usuarioModel.updateUser(

            id_usuario,
            nombre,
            email,
            contrasena,
            rol

        );

        //Mostramos el usuario actualizado
        res.json(resultado.rows[0]);

    } catch(error){

        //Si hay un error lo mostramos
        console.error(error);

        //Avisamos de que ha habido un error
        res.status(500).json({
           
            error: "Error al actualizar el usuario"

        });   
    }  
};


//======ELIMINAR USUARIO======//
//Esta función sirve para eliminar un usuario recibiendo su id desde la URL

const deleteUser = async(req,res) => {

    try{

        //Cogemos el id de la URL
        const { id_usuario } = req.params;

        //Llamamos a la funcion deleteUser del modelo
        const resultado = await usuarioModel.deleteUser(id_usuario);

        //Mostramos el resultado que hemos eliminado.
        res.json(resultado.rows[0]);

    }catch(error){

        //Si ocurre algún error, lo mostramos en la consola
        console.error(error);

        //Avisamos al cliente de que ha habido un error
        res.status(500).json({

            error: "Error al eliminar al usuario"

        });
 }
    

};





//======LOGIN DE USUARIO======//

const loginUser = async (req, res) => {

    try {

        //Recogemos el email y la contraseña enviados por el usuario
        const { email, contrasena } = req.body;

        //Buscamos al usuario por su email
        const usuario = await usuarioModel.getUserByEmail(email);

        //Si no existe ningún usuario con ese email
        if (!usuario) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }


        //Creamos un token para el usuario que ha iniciado sesión
        const token = jwt.sign(


            {

                id_usuario: usuario.id_usuario,
                rol: usuario.rol

            },

            process.env.JWT_SECRET,
            {

                expiresIn: "1h"

            }

        );



        // Comparamos la contraseña escrita con el hash guardado
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        // Si la contraseña no coincide
        if (!contrasenaCorrecta) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }

        // Si todo es correcto
        res.status(200).json({

            mensaje: "Login correcto",

            token: token,

            usuario: {

                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol

            }

        
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al iniciar sesión"
        });

    }

};







//EXPORTAMOS LAS FUNCIONES PARA PODER UTILIZARLAS
//DESDE NUESTRO ARCHIVO DE RUTAS (usuario.routes.js).
module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser

};

// STATUS 500 → significa que ha ocurrido un error en el servidor.

// STATUS 201 → significa que hemos creado algo correctamente.
// Lo usamos al crear un nuevo usuario.

// resultado.rows[0] → [0] significa que queremos coger
// el primer elemento que nos devuelve la base de datos.

// MÓDULOS → permiten organizar el código en diferentes archivos
// y utilizar funciones de un archivo desde otro.

// module.exports → indica qué funciones queremos permitir
// que otros archivos puedan utilizar.