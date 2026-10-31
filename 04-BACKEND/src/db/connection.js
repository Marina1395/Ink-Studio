

/*----Importamos Pool de pg para conectarnos a PostgreSQL----*/
const { Pool } = require("pg");

/*----Cargamos las variables de entorno del archivo .env----*/
require("dotenv").config();


//=======CONEXIÓN CON POSTGRESQL=======//
/*----Creamos un pool de conexiones utilizando los datos del archivo .env----*/

const pool = new Pool({

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD

});

//=======EXPORTAR CONEXIÓN=======//
/*----Exportamos el pool para utilizarlo en los modelos de nuestra API----*/
module.exports = pool;