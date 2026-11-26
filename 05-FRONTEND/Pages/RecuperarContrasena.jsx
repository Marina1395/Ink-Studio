import { useState } from "react";
import { Link } from "react-router-dom";


//=======RECUPERAR CONTRASEÑA=======//

function RecuperarContrasena() {

    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);


    /*----Enviamos la solicitud de recuperación de contraseña----*/
    const solicitarRecuperacion = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");
        setCargando(true);

        try {

            const respuesta = await fetch(
                "http://localhost:3000/usuarios/recuperar-contrasena",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase()
                    })
                }
            );

            const datos = await respuesta.json();


            /*----Comprobamos si la solicitud ha sido correcta----*/
            if (!respuesta.ok) {

                setError(
                    datos.error || "No se ha podido realizar la solicitud"
                );

                return;

            }

            setMensaje(datos.mensaje);

        } catch {

            setError("No se ha podido conectar con el servidor");

        } finally {

            setCargando(false);

        }

    };


    /*----Mostramos el formulario de recuperación----*/
    return (

        <section className="recuperar-contrasena">

            <h1>Recuperar contraseña</h1>

            <p>
                Introduce tu correo electrónico para recibir
                un enlace de recuperación.
            </p>

            <form onSubmit={solicitarRecuperacion}>

                <label htmlFor="email">
                    Correo electrónico
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={cargando}
                />

                <button type="submit" disabled={cargando}>

                    {cargando
                        ? "Enviando..."
                        : "Recuperar contraseña"}

                </button>

            </form>

            {mensaje && <p role="status">{mensaje}</p>}

            {error && <p role="alert">{error}</p>}

            <Link to="/login">
                Volver a iniciar sesión
            </Link>

        </section>

    );

}


//=======EXPORTAMOS EL COMPONENTE=======//

export default RecuperarContrasena;