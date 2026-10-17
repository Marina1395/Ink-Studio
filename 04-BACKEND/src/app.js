
const express = require ("express"); //<--Quiero utilizar express en este archivo

const cors =require("cors");//-->Importamos CORS para permitir que React pueda leer las respuestas de nuestro Backend





const testRoutes = require("./routes/test.routes"); //<--Coge las rutas que hemos creado en test.routes.js




// Importamos las rutas de usuarios.
const usuarioRoutes = require("./routes/usuario.routes");
const clienteRoutes = require("./routes/cliente.routes");
const artistaRoutes = require("./routes/artista.routes");
const trabajoRoutes = require("./routes/trabajo.routes");
const servicioRoutes = require("./routes/servicio.routes");
const citaRoutes = require("./routes/cita.routes");
const mensajeRoutes = require("./routes/mensaje.routes");



const app = express ();//<--Creamos nuestra aplicacion express

app.use(cors({//-->Activamos CORS para que REACT pueda recibir datos desde nuestro Backend

     origin: "http://localhost:5173"

}));



app.use(express.json());//<--Permite que express pueda recibir datos en formato JSON


const PORT = 3000;//<--elegimos el puerto
app.use("/", testRoutes);//<--Le estamos diciendo a Express Utiliza estas rutas en mi servidor.



// Le decimos a Express que todas las rutas de usuarios
// comienzan por /usuarios.
app.use("/usuarios", usuarioRoutes);
app.use("/clientes",clienteRoutes);
app.use("/artistas",artistaRoutes);
app.use("/trabajos",trabajoRoutes);
app.use("/servicios",servicioRoutes);
app.use("/citas",citaRoutes);
app.use("/mensajes",mensajeRoutes);



 

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);//<--enciende el servidor y usa el puesto 3000

//3000 es un puerto muy utilizado para servidores de desarrollo con Node.js/Express.

});

