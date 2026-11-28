/*----Importamos Express para crear nuestro servidor----*/
const express = require("express");

/*----Importamos CORS para permitir la comunicación entre React y el backend----*/
const cors = require("cors");


//=======IMPORTAR RUTAS=======//

/*----Importamos las rutas de prueba----*/
const testRoutes = require("./routes/test.routes");

/*----Importamos las rutas de los diferentes apartados de Hache Studio----*/
const usuarioRoutes = require("./routes/usuario.routes");
const clienteRoutes = require("./routes/cliente.routes");
const artistaRoutes = require("./routes/artista.routes");
const trabajoRoutes = require("./routes/trabajo.routes");
const servicioRoutes = require("./routes/servicio.routes");
const citaRoutes = require("./routes/cita.routes");
const mensajeRoutes = require("./routes/mensaje.routes");


//=======CONFIGURAR EXPRESS=======//

/*----Creamos nuestra aplicación Express----*/
const app = express();

/*----Activamos CORS para permitir peticiones desde desarrollo y producción local----*/
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:4173"
    ]
}));

/*----Permitimos que Express reciba datos en formato JSON----*/
app.use(express.json());


//=======CONFIGURAR RUTAS=======//

/*----Registramos las rutas de prueba----*/
app.use("/", testRoutes);

/*----Indicamos la dirección principal de cada grupo de rutas----*/
app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/artistas", artistaRoutes);
app.use("/trabajos", trabajoRoutes);
app.use("/servicios", servicioRoutes);
app.use("/citas", citaRoutes);
app.use("/mensajes", mensajeRoutes);


//=======GESTIONAR RUTAS NO ENCONTRADAS=======//

/*----Devolvemos un error 404 cuando la ruta solicitada no existe----*/
app.use((req, res) => {

    return res.status(404).json({
        error: "Ruta no encontrada"
    });

});


//=======GESTIONAR ERRORES DEL SERVIDOR=======//

/*----Controlamos los errores que llegan desde los middlewares y las rutas----*/
app.use((error, req, res, next) => {

    console.error("Error del servidor:", error);

    /*----Si el error ya tiene un código HTTP válido, lo utilizamos----*/
    const estado = error.status || error.statusCode || 500;

    const codigoEstado = Number.isInteger(estado) && estado >= 400 && estado <= 599
        ? estado
        : 500;

    /*----Devolvemos una respuesta sin mostrar información interna del servidor----*/
    return res.status(codigoEstado).json({
        error: codigoEstado === 500
            ? "Error interno del servidor"
            : "Error al procesar la petición"
    });

});


//=======INICIAR SERVIDOR=======//

/*----Indicamos el puerto en el que se ejecutará nuestro servidor----*/
const PORT = process.env.PORT || 3000;

/*----Iniciamos el servidor y mostramos un mensaje en la consola----*/
app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

});