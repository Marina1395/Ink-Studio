
require("dotenv").config();

const readline = require("node:readline");
const usuarioModel = require("./src/models/user.model");
const pool = require("./src/db/connection");

// ID del administrador de prueba
const ADMIN_ID = 14;

// Preparamos la terminal para introducir la contraseña
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para restablecer la contraseña
async function restablecerAdmin() {

    try {

        const nuevaContrasena = await new Promise((resolve) => {

            rl.question(
                "Escribe la nueva contraseña del administrador: ",
                resolve
            );

        });

        // Comprobamos la longitud de la contraseña
        if (nuevaContrasena.length < 8 || nuevaContrasena.length > 72) {

            console.log("La contraseña debe tener entre 8 y 72 caracteres.");
            return;

        }

        // Cambiamos la contraseña mediante el modelo
        // El modelo utiliza bcrypt para protegerla
        const administrador = await usuarioModel.cambiarContrasena(
            ADMIN_ID,
            nuevaContrasena
        );

        // Comprobamos que el administrador existe
        if (!administrador) {

            console.log("No se ha encontrado el administrador.");
            return;

        }

        console.log("Contraseña actualizada correctamente.");

    } catch (error) {

        console.error("Error al restablecer la contraseña:", error.message);

    } finally {

        rl.close();
        await pool.end();

    }

}

// Ejecutamos la función
restablecerAdmin();
