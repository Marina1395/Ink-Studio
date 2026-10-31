


const usuarioModel = require("../models/user.model");



const bcrypt = require("bcrypt");



//3-=====USAMOS LIBRERIA JSONWEBTOKEN EN CONTROLLER=====//
const jwt = require("jsonwebtoken");




const getUsers = async (req, res) => {

    try {

        // Llamamos a la función getUsers() del modelo.
        // await espera a que PostgreSQL nos devuelva los datos.

        const resultado = await usuarioModel.getUsers();

        // resultado.rows contiene las filas que ha devuelto PostgreSQL.
        // res.json() envía esas filas al cliente en formato JSON.
        res.json(resultado.rows);

    } catch (error) {

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




//=====CREAR FUNCIÓN PARA CREAR USUARIO=====//
const createUser = async (req, res) => {

    try {

        //Recogemos los datos que nos envia el usuario
        const { nombre, email, contrasena } = req.body;


        //Comprobamos que todos los campos obligatorios tengan datos
        if (!nombre || !email || !contrasena) {

            return res.status(400).json({

                error: "Nombre, email y contraseña son obligatorios"


            });

        }


        /* Comprobamos las condiciones del nombre*/
        if (nombre.trim().length < 2 || nombre.trim().length > 100) {

            return res.status(400).json({


                error: "El nombre debe tener entre 2 y 100 caracteres"

            });

        }




        /*Comprobamos que la CONTRASEÑA tenga al menos 8 caracteres*/
        if (contrasena.length < 8 || contrasena.length > 72) {

            return res.status(400).json({


                error: "La contraseña debe tener al menos 8 caracteres"

            });

        }



        /*Comprobamos que el email tenga un formato válido*/
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {

            return res.status(400).json({

                error: "El email no tiene un formato válido"

            });

        }


        /*Comprobamos si ya existe un usuario con ese email*/
        const usuarioExistente = await usuarioModel.getUserByEmail(email);

        if (usuarioExistente) {


            return res.status(409).json({

                error: "Ya existe un usuario registrado con ese email"

            });

        }



        //Los usuarios que se registren siempre tendran un rol de cliente
        const rol = "cliente";



        //LLamamos  a la funcion createUser del modelo
        const resultado = await usuarioModel.createUser(

            nombre,
            email,
            contrasena,
            rol
        );

        //Enviamos el usuario creado como respuesta

        res.status(201).json(resultado.rows[0]);


    } catch (error) {

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



    } catch (error) {

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

    try {

        //Cogemos el id de la URL
        const { id_usuario } = req.params;


        //Cogemos los nuevos datos
        const { nombre, email, contrasena, rol } = req.body;


        //Si el usuario no es administrador no podrá cambiar su propio rol
        if (req.usuario.rol !== "admin" && rol !== req.usuario.rol) {

            return res.status(403).json({

                error: "No tienes permiso para cambiar tu rol"

            });

        }

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

    } catch (error) {

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

const deleteUser = async (req, res) => {

    try {

        //Cogemos el id de la URL
        const { id_usuario } = req.params;

        //Llamamos a la funcion deleteUser del modelo
        const resultado = await usuarioModel.deleteUser(id_usuario);

        //Mostramos el resultado que hemos eliminado.
        res.json(resultado.rows[0]);

    } catch (error) {

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

        // Recogemos el email y la contraseña
        const { email, contrasena } = req.body;

        // Comprobamos que se hayan enviado
        if (!email || !contrasena) {

            return res.status(400).json({
                error: "Email y contraseña son obligatorios"
            });

        }

        // Buscamos al usuario por su email
        const usuario = await usuarioModel.getUserByEmail(email);

        // Si no existe el usuario
        if (!usuario) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }

        // Comparamos la contraseña con el hash guardado
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        // Si la contraseña es incorrecta
        if (!contrasenaCorrecta) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }

        // Creamos el token SOLO si la contraseña es correcta
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

        // Devolvemos los datos del usuario autenticado
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