

/*----Importamos la conexión con nuestra base de datos PostgreSQL----*/
const pool = require("../db/connection");



//====OBTENER TODOS LOS CLIENTES====//

/*----Obtenemos todos los registros de la tabla cliente----*/
const getClientes = async () => {

    const result = await pool.query("SELECT * FROM cliente");

    return result.rows;
};


/*----Buscamos un cliente utilizando su ID----*/
const getClienteById = async(id) => {

    const result = await pool.query(

        "SELECT * FROM cliente WHERE id_cliente = $1",
        [id]

    );

  return result.rows[0];
};




//=======OBTENER CLIENTE POR ID DE USUARIO=======//

/*----Buscamos el cliente relacionado con un usuario----*/
const getClienteByUsuarioId = async (id_usuario) => {

    const result = await pool.query(

         "SELECT * FROM cliente WHERE id_usuario= $1",
         [id_usuario]

    );

    return result.rows[0];

};




//=======CREAR CLIENTE=======//

/*----Insertamos un nuevo cliente en la base de datos----*/

const createCliente = async (cliente) => {

    

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




//=======ACTUALIZAR CLIENTE=======//

/*----Actualizamos los datos de un cliente utilizando su ID----*/
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

};

    


//=======ELIMINAR CLIENTE=======//

/*----Eliminamos un cliente de la base de datos utilizando su ID----*/

const deleteCliente = async (id) => {

    const result = await pool.query(

        "DELETE FROM cliente WHERE id_cliente = $1 RETURNING *",
        [id]

    );

    return result.rows[0];
}


//=======EXPORTAR FUNCIONES=======//

/*----Exportamos las funciones para utilizarlas en el controlador de clientes----*/

module.exports = {

    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    getClienteByUsuarioId
    
};


