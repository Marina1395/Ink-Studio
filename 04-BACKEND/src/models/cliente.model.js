

//IMPORTAMOS LA CONEXION CON POSTGRE SQL
const pool = require("../db/connection");



//Obtener todos los clientes
const getClientes = async () => {

    const result = await pool.query("SELECT * FROM cliente");
    return result.rows;
};


//Obtener los clientes por su id
const getClienteById = async(id) => {

    const result = await pool.query(

        "SELECT * FROM cliente WHERE id_cliente = $1",
        [id]
    );

  return result.rows[0];
};


//Crear un cliente

const createCliente = async (cliente) => {

    //1.INSERT INTO CLIENTE-->Quiero insertar un nuevo registro en la tabla cliente
    //2.DESPUÉS INDICAMOS QUE COLUMNAS VAMOS A RELLENAR(nombre, apellidos.....);
    //3.$1,$2,$3,$4...ES EL NUMERO TOTAL DE VALORES.
    //4.RETURNING-->DESPUES DE CREAR EL CLIENTE, DEVUÉLVEME EL REGISTRO QUE ACABAS DE CREAR.

    const result = await pool.query(

        "INSERT INTO cliente (nombre, apellidos, telefono, direccion, id_usuario)VALUES ($1,$2,$3,$4,$5) RETURNING *",

        [

            cliente.nombre,
            cliente.apellidos,
            cliente.telefono,
            cliente.direccion,
            cliente.id_usuario,
        ]
    );

    return result.rows[0];
 
};




//Actualizar cliente
const updateCliente = async(id,cliente) => {

    const result = await pool.query(

        "UPDATE cliente SET nombre = $1, apellidos=$2, telefono=$3, direccion=$4, id_usuario=$5 WHERE id_cliente = $6 RETURNING *",
        [

            cliente.nombre,
            cliente.apellidos,
            cliente.telefono,
            cliente.direccion,
            cliente.id_usuario,
            id
        ]
   );

   return result.rows[0];

    /*<====IMPORTANTE=====>
    id_usuario = $5--->Quiero cambiar el usuario relacionado con este cliente.*/
}




// Eliminar un cliente
const deleteCliente = async (id) => {
    const result = await pool.query(
        "DELETE FROM cliente WHERE id_cliente = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}


//Estas son las funciones de este archivo que quiero que otros puedan utilizar

module.exports = {

    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
    
};


