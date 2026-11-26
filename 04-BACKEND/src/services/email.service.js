/*----Importamos Nodemailer para gestionar el envío de correos----*/
const nodemailer = require("nodemailer");


/*----Guardamos el transportador de correo----*/
let transportador;


//=======CONFIGURAR EL SERVICIO DE CORREO=======//

const obtenerTransportador = async () => {

    /*----Reutilizamos el transportador si ya está configurado----*/
    if (transportador) {

        return transportador;

    }


    /*----Creamos una cuenta de correo de pruebas----*/
    const cuentaPrueba = await nodemailer.createTestAccount();


    /*----Configuramos el servidor SMTP de Ethereal----*/
    transportador = nodemailer.createTransport({

        host: cuentaPrueba.smtp.host,
        port: cuentaPrueba.smtp.port,
        secure: cuentaPrueba.smtp.secure,

        auth: {

            user: cuentaPrueba.user,
            pass: cuentaPrueba.pass

        }

    });

    return transportador;

};


//=======ENVIAR CORREO DE RECUPERACIÓN=======//

const enviarCorreoRecuperacion = async (email, token) => {

    /*----Obtenemos el servicio de correo configurado----*/
    const servicioCorreo = await obtenerTransportador();


    /*----Construimos el enlace de recuperación----*/
    const enlace = `http://localhost:5173/restablecer-contrasena?token=${token}`;


    /*----Preparamos y enviamos el correo de recuperación----*/
    const resultado = await servicioCorreo.sendMail({

        from: '"Hache Studio" <no-reply@hachestudio.example>',
        to: email,
        subject: "Recuperación de contraseña - Hache Studio",

        text: `
            Has solicitado recuperar tu contraseña de Hache Studio.

            Accede al siguiente enlace para establecer una nueva:

            ${enlace}

            El enlace caducará en 15 minutos.

            Si no has solicitado este cambio, ignora este correo.
        `

    });


    /*----Mostramos el enlace de visualización solo durante las pruebas----*/
    if (process.env.NODE_ENV !== "production") {

        console.log(
            "Correo de recuperación de prueba:",
            nodemailer.getTestMessageUrl(resultado)
        );

    }

};


//=======EXPORTAMOS LAS FUNCIONES=======//

module.exports = {

    enviarCorreoRecuperacion

};