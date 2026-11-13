
/*========== PÁGINA DE REGISTRO DE CLIENTES ==========*/

import { useState } from "react";

/*----Importamos Link para navegar entre páginas----*/
import { Link } from "react-router-dom";


function Registro() {

    /*----Guardamos el nombre introducido por el cliente----*/
    const [nombre, setNombre] = useState("");

    /*----Guardamos los apellidos introducidos por el cliente----*/
    const [apellidos, setApellidos] = useState("");

    /*----Guardamos el correo electrónico del cliente----*/
    const [email, setEmail] = useState("");

    /*----Guardamos la contraseña del cliente----*/
    const [contrasena, setContrasena] = useState("");

    /*----Guardamos el teléfono del cliente----*/
    const [telefono, setTelefono] = useState("");

    /*----Guardamos la dirección opcional del cliente----*/
    const [direccion, setDireccion] = useState("");

    /*----Guardamos los posibles errores durante el registro----*/
    const [errorRegistro, setErrorRegistro] = useState("");

    /*----Guardamos el mensaje de registro correcto----*/
    const [mensajeRegistro, setMensajeRegistro] = useState("");


    /*----Función para registrar un nuevo cliente----*/
    const registrarCliente = async (evento) => {

        /*----Evitamos que el formulario recargue la página----*/
        evento.preventDefault();

        /*----Limpiamos los mensajes anteriores----*/
        setErrorRegistro("");
        setMensajeRegistro("");

        try {

            /*----Enviamos los datos del cliente al backend----*/
            const respuesta = await fetch("http://localhost:3000/usuarios", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nombre,
                    apellidos,
                    email,
                    contrasena,
                    telefono,
                    direccion
                })

            });

            /*----Convertimos la respuesta del servidor a JSON----*/
            const datos = await respuesta.json();

            /*----Comprobamos si el registro ha fallado----*/
            if (!respuesta.ok) {

                setErrorRegistro(
                    datos.error ||
                    datos.mensaje ||
                    "Error al registrar el cliente"
                );

                return;

            }

            /*----Confirmamos que el cliente se ha registrado correctamente----*/
            setMensajeRegistro(
                datos.mensaje || "Cuenta creada correctamente"
            );

            /*----Limpiamos los campos después del registro correcto----*/
            setNombre("");
            setApellidos("");
            setEmail("");
            setContrasena("");
            setTelefono("");
            setDireccion("");

        } catch (error) {

            /*----Controlamos los errores de conexión con el servidor----*/
            console.error("Error durante el registro:", error);

            setErrorRegistro(
                "No se ha podido conectar con el servidor. Inténtalo de nuevo."
            );

        }

    };


    /*----Mostramos el formulario de registro de Hache Studio----*/
    return (

        <div className="registro-usuario">

            {/*----Título de la página de registro----*/}
            <h2>Crear cuenta</h2>

            {/*----Información para los nuevos clientes----*/}
            <p>
                Regístrate en Hache Studio para reservar
                tus citas de tatuaje o piercing.
            </p>


            {/*----Formulario para registrar nuevos clientes----*/}
            <form onSubmit={registrarCliente}>

                {/*----Campo para introducir el nombre----*/}
                <label htmlFor="nombre-registro">
                    Nombre:
                </label>

                <input
                    id="nombre-registro"
                    type="text"
                    name="nombre"
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    autoComplete="given-name"
                    required
                />


                {/*----Campo para introducir los apellidos----*/}
                <label htmlFor="apellidos-registro">
                    Apellidos:
                </label>

                <input
                    id="apellidos-registro"
                    type="text"
                    name="apellidos"
                    value={apellidos}
                    onChange={(evento) => setApellidos(evento.target.value)}
                    autoComplete="family-name"
                    required
                />


                {/*----Campo para introducir el correo electrónico----*/}
                <label htmlFor="email-registro">
                    Correo electrónico:
                </label>

                <input
                    id="email-registro"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    autoComplete="email"
                    required
                />


                {/*----Campo para introducir la contraseña----*/}
                <label htmlFor="contrasena-registro">
                    Contraseña:
                </label>

                <input
                    id="contrasena-registro"
                    type="password"
                    name="contrasena"
                    value={contrasena}
                    onChange={(evento) => setContrasena(evento.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                />


                {/*----Campo para introducir el teléfono----*/}
                <label htmlFor="telefono-registro">
                    Teléfono:
                </label>

                <input
                    id="telefono-registro"
                    type="tel"
                    name="telefono"
                    value={telefono}
                    onChange={(evento) => setTelefono(evento.target.value)}
                    autoComplete="tel"
                    required
                />


                {/*----Campo opcional para introducir la dirección----*/}
                <label htmlFor="direccion-registro">
                    Dirección (opcional):
                </label>

                <input
                    id="direccion-registro"
                    type="text"
                    name="direccion"
                    value={direccion}
                    onChange={(evento) => setDireccion(evento.target.value)}
                    autoComplete="street-address"
                />


                {/*----Botón para enviar el formulario de registro----*/}
                <button type="submit">
                    Crear cuenta
                </button>


                {/*----Mostramos los errores del registro----*/}
                {errorRegistro && (
                    <p className="error-registro">
                        {errorRegistro}
                    </p>
                )}


                {/*----Mostramos la confirmación del registro----*/}
                {mensajeRegistro && (
                    <p className="mensaje-registro">
                        {mensajeRegistro}
                    </p>
                )}

            </form>



            {/*----Enlace para clientes que ya tienen una cuenta----*/}
            <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login">

                    Inicia sesión
                    
                </Link>
            </p>


        </div>

    );

}

/*----Exportamos el componente para utilizarlo en App.jsx----*/
export default Registro;
