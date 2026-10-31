

const artistaModel = require("../models/artista.model");
const usuarioModel = require("../models/user.model");



//========OBTENER TODOS LOS ARTISTAS======//
const getArtistas = async (req, res) => {

    try {

        /*----Buscamos todos los artistas registrados en la base de datos----*/
        const resultado = await artistaModel.getArtistas();

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);


        res.status(500).json({


            error: "Error al obtener los artistas",

        });

    }

};




//=======OBTENER ARTISTA POR ID=======//
const getArtistaById = async (req, res) => {

    try {

        const { id_usuario } = req.params;

        /*----Buscamos el artista correspondiente a ese usuario----*/
        const resultado = await artistaModel.getArtistaById(id_usuario);

        if (!resultado) {

            return res.status(404).json({

                error: "Artista no encontrado"

            });
        }

        return res.status(200).json(resultado);


    } catch (error) {


        console.error(error)

        res.status(500).json({

            error: "Error al obtener al artista por su id"

        });

    }


};




//=======CREAR ARTISTA=======//

const createArtista = async (req, res) => {

    try {

        /*----Recogemos los datos necesarios para registrar al nuevo artista----*/
        const { nombre, email, contrasena, especialidad, descripcion } = req.body;


        /*----Comprobamos que no falte ningún dato obligatorio----*/
        if (!nombre || !email || !contrasena || !especialidad || !descripcion) {

            return res.status(400).json({

                error: "Faltan los campos obligatorios"

            });
        }

        /*----Comprobamos que la contraseña sea un texto y tenga entre 8 y 72 caracteres----*/
        if (

            typeof contrasena !== "string" ||
            contrasena.length < 8 ||
            contrasena.length > 72

        ) {

            return res.status(400).json({

                error: "La contraseña debe tener entre 8 y 72 caracteres"

            })
        }


        /*----Comprobamos que no exista otra cuenta con el mismo correo----*/
        const usuarioExistente = await usuarioModel.getUserByEmail(email);

        if (usuarioExistente) {

            return res.status(409).json({

                error: "Ya existe un usuario con ese email"

            });
        }


        /*----Creamos la cuenta del usuario con el rol de artista----*/
        /*----La contraseña se protege en el modelo mediante bcrypt----*/
        const nuevoUsuario = await usuarioModel.createUser(

            nombre,
            email,
            contrasena,
            "artista"

        );


        /*----Recogemos el ID que PostgreSQL ha generado para el nuevo usuario----*/
        const id_usuario = nuevoUsuario.rows[0].id_usuario;


        /*----Creamos el perfil profesional asociado a su cuenta----*/
        const nuevoArtista = await artistaModel.createArtista(

            id_usuario,
            especialidad,
            descripcion || ""

        );


        /*----Devolvemos los datos del artista registrado sin incluir su contraseña----*/
        return res.status(201).json({

            mensaje: "Artista registrado correctamente",
            usuario: nuevoUsuario.rows[0],
            artista: nuevoArtista

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error: "Error al registrar el artista"

        });

    }

};



//=======ACTUALIZAR ARTISTA=======//


const updateArtista = async (req, res) => {

    try {

        /*----Recogemos el ID del artista que queremos modificar----*/
        const id_usuario = req.params.id_usuario;


        /*----Recogemos los datos que queremos actualizar----*/
        const { especialidad, descripcion } = req.body;
        

        /*----Agrupamos en un objeto los datos del artista que queremos actualizar----*/
         const artista = {

            especialidad,
            descripcion

        };


        /*----Enviamos los nuevos datos al modelo para actualizar el perfil----*/
        const resultado = await artistaModel.updateArtista(id_usuario, artista);

        if (!resultado) {

            return res.status(404).json({

                error: "Artista no encontrado"

            });

        }

        return res.status(200).json(resultado);



    } catch (error) {


        console.error(error);


        res.status(500).json({

            error: "Error al actualizar el artista"

        });
    }

};




//=======ELIMINAR ARTISTA=======//
const deleteArtista = async (req, res) => {

    try {

        /*----Recogemos el ID del artista que queremos eliminar----*/
        const id_usuario = req.params.id_usuario;

        /*----Eliminamos el perfil del artista desde el modelo----*/
        const resultado = await artistaModel.deleteArtista(id_usuario);

        if (!resultado) {

            return res.status(404).json({

                error: "Artista no encontrado"
            });

        }

        return res.status(200).json(resultado);


    } catch (error) {

        console.error(error);


        res.status(500).json({

            error: "Error al borrar el artista"

        });

    }

};


//=======EXPORTAR FUNCIONES=======//

module.exports = {

    getArtistas,
    getArtistaById,
    createArtista,
    updateArtista,
    deleteArtista

};
