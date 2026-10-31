


const usuarioModel = require("../models/user.model");


/*----Importamos bcrypt para comprobar las contraseñas durante el login----*/
const bcrypt = require("bcrypt");



/*----Importamos jsonwebtoken para generar los tokens de autenticación----*/
const jwt = require("jsonwebtoken");



//=======OBTENER TODOS LOS USUARIOS=======//


const getUsers = async (req, res) => {

    try {


        /*----Obtenemos todos los usuarios registrados desde el modelo----*/
        const resultado = await usuarioModel.getUsers();

        /*----Devolvemos los usuarios encontrados en formato JSON----*/
        res.json(resultado.rows);

    } catch (error) {


        console.error(error);


        /*----Devolvemos un error si no podemos obtener los usuarios----*/
        res.status(500).json({


            error: "Error al obtener los usuarios"

        });

    }

};




//======= CREAR USUARIO=======//


const createUser = async (req, res) => {

    try {

        /*----Recogemos los datos que nos envía el usuario----*/
        const { nombre, email, contrasena } = req.body;


        /*----Comprobamos que no falte ningún campo obligatorio----*/
        if (!nombre || !email || !contrasena) {

            return res.status(400).json({

                error: "Nombre, email y contraseña son obligatorios"


            });

        }



        /*----Comprobamos que los datos recibidos sean textos----*/
        if (

            typeof nombre !== "string" ||
            typeof email !== "string" ||
            typeof contrasena !== "string"

        ) {
            return res.status(400).json({

                error: "Nombre, email y contraseña deben ser textos"

            });
        }

        /*----Comprobamos que el nombre tenga entre 2 y 100 caracteres----*/
        const nombreLimpio = nombre.trim();

        if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {

            return res.status(400).json({

                error: "El nombre debe tener entre 2 y 100 caracteres"
            });
        }




        /*----Comprobamos que la contraseña tenga entre 8 y 72 caracteres----*/
        if (contrasena.length < 8 || contrasena.length > 72) {

            return res.status(400).json({


                error: "La contraseña debe tener entre 8 y 72 caracteres"

            });

        }



        /*Comprobamos que el email tenga un formato válido*/
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {

            return res.status(400).json({

                error: "El email no tiene un formato válido"

            });

        }


        /*----Comprobamos si ya existe un usuario registrado con ese correo electrónico----*/
        const usuarioExistente = await usuarioModel.getUserByEmail(email);

        if (usuarioExistente) {


            return res.status(409).json({

                error: "Ya existe un usuario registrado con ese email"

            });

        }



        /*----Asignamos el rol de cliente a todos los usuarios que se registren----*/
        const rol = "cliente";



        /*----Enviamos los datos al modelo para guardar el nuevo usuario en la base de datos----*/
        const resultado = await usuarioModel.createUser(

            nombre,
            email,
            contrasena,
            rol

        );


        /*----Devolvemos los datos del usuario que acabamos de registrar----*/
        return res.status(201).json(resultado.rows[0]);




    } catch (error) {


        console.error(error);


        res.status(500).json({

            error: "Error al crear el usuario"

        });
    }
};




//======OBTENER UN USUARIO POR ID ======

const getUserById = async (req, res) => {

    try {

        /*----Recogemos el ID del usuario que viene en la URL----*/
        const { id_usuario } = req.params;

        /*----Buscamos el usuario correspondiente a ese ID desde el modelo----*/
        const resultado = await usuarioModel.getUserById(id_usuario);

        /*----Comprobamos si el usuario existe en la base de datos----*/
        if (!resultado.rows[0]) {

            return res.status(404).json({

                error: "Usuario no encontrado"

            });
        }

        /*----Devolvemos los datos del usuario encontrado----*/
        return res.status(200).json(resultado.rows[0]);


    } catch (error) {


        console.error(error);

        /*----Devolvemos un error si no podemos obtener el usuario----*/
        res.status(500).json({

            error: "Error al obtener el usuario"

        });
    }
};





//=======ACTUALIZAR USUARIO=======//

const updateUser = async (req, res) => {

    try {

        /*----Recogemos el ID del usuario que queremos actualizar----*/
        const { id_usuario } = req.params;

        /*----Recogemos los nuevos datos del usuario----*/
        const { nombre, email, contrasena, rol } = req.body;

        /*----Comprobamos que el usuario haya iniciado sesión----*/
        if (!req.usuario) {

            return res.status(401).json({

                error: "Debes iniciar sesión"

            });
        }

        /*----Comprobamos que sea administrador o que esté modificando su propia cuenta----*/
        if (
            req.usuario.rol !== "admin" &&
            String(req.usuario.id_usuario) !== String(id_usuario)
        ) {
            return res.status(403).json({

                error: "No tienes permiso para modificar este usuario"
            });

        }

        /*----Comprobamos que los datos obligatorios sean válidos----*/
        if (

            typeof nombre !== "string" ||
            typeof email !== "string" ||
            typeof contrasena !== "string" ||
            typeof rol !== "string" ||
            !nombre.trim() ||
            !email.trim() ||
            contrasena.length < 8 ||
            contrasena.length > 72

        ) {
            return res.status(400).json({
                error: "Los datos del usuario no son válidos"
            });
        }

        /*----Buscamos el usuario para comprobar que existe y conocer su rol actual----*/
        const usuarioActual = await usuarioModel.getUserById(id_usuario);

        if (!usuarioActual.rows[0]) {

            return res.status(404).json({

                error: "Usuario no encontrado"

            });
        }


        /*----Impedimos que un usuario que no sea administrador cambie su rol----*/
        if (

            req.usuario.rol !== "admin" &&
            rol !== usuarioActual.rows[0].rol

        ) {
            return res.status(403).json({

                error: "No tienes permiso para cambiar tu rol"

            });
        }

        /*----Enviamos los nuevos datos al modelo para actualizar el usuario----*/
        const resultado = await usuarioModel.updateUser(

            id_usuario,
            nombre,
            email,
            contrasena,
            rol

        );

        /*----Devolvemos los datos del usuario actualizado----*/
        return res.status(200).json(resultado.rows[0]);

    } catch (error) {

        console.error(error);

        /*----Devolvemos un error si no podemos actualizar el usuario----*/
        return res.status(500).json({

            error: "Error al actualizar el usuario"

        });

    }

};




//=======ELIMINAR USUARIO=======//

const deleteUser = async (req, res) => {

    try {

        /*----Recogemos el ID del usuario que queremos eliminar----*/
        const { id_usuario } = req.params;

        /*----Comprobamos que el usuario haya iniciado sesión----*/
        if (!req.usuario) {

            return res.status(401).json({

                error: "Debes iniciar sesión"
            });
        }

        /*----Comprobamos que sea administrador o que quiera eliminar su propia cuenta----*/
        if (

            req.usuario.rol !== "admin" &&
            String(req.usuario.id_usuario) !== String(id_usuario)

        ) {
            return res.status(403).json({

                error: "No tienes permiso para eliminar este usuario"

            });
        }

        /*----Enviamos el ID al modelo para eliminar el usuario----*/
        const resultado = await usuarioModel.deleteUser(id_usuario);

        /*----Comprobamos si se ha eliminado algún usuario----*/
        if (resultado.rowCount === 0) {

            return res.status(404).json({

                error: "Usuario no encontrado"

            });
        }

        /*----Confirmamos que el usuario se ha eliminado correctamente----*/
        return res.status(200).json({

            mensaje: "Usuario eliminado correctamente"

        });

    } catch (error) {

        console.error(error);

        /*----Devolvemos un error si no podemos eliminar el usuario----*/

        return res.status(500).json({

            error: "Error al eliminar el usuario"
        });

    }

};





//=======LOGIN DE USUARIO=======//

const loginUser = async (req, res) => {

    try {

        /*----Recogemos el email y la contraseña enviados por el usuario----*/
        const { email, contrasena } = req.body;

        /*----Comprobamos que no falte ningún campo obligatorio----*/
        if (!email || !contrasena) {

            return res.status(400).json({
                error: "Email y contraseña son obligatorios"
            });

        }

        /*----Comprobamos que el email y la contraseña sean textos----*/
        if (typeof email !== "string" || typeof contrasena !== "string") {

            return res.status(400).json({
                error: "Email y contraseña deben ser textos"
            });

        }

        /*----Buscamos al usuario en la base de datos mediante su email----*/
        const usuario = await usuarioModel.getUserByEmail(email);

        /*----Comprobamos si existe un usuario con ese correo----*/
        if (!usuario) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }

        /*----Comparamos la contraseña recibida con el hash guardado----*/
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        /*----Comprobamos si la contraseña es incorrecta----*/
        if (!contrasenaCorrecta) {

            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            });

        }

        /*----Creamos un token JWT si el usuario se ha autenticado correctamente----*/
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

        /*----Devolvemos el token y los datos del usuario sin incluir su contraseña----*/
        return res.status(200).json({

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

        /*----Devolvemos un error si no podemos iniciar sesión----*/
        return res.status(500).json({

            error: "Error al iniciar sesión"

        });

    }

};






//======EXPORTAMOS FUNCIONES=======//

module.exports = {

    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser

};

