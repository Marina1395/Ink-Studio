import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";


//=======RESTABLECER CONTRASEÑA=======//

function RestablecerContrasena() {

    /*----Obtenemos el token del enlace de recuperación----*/
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");


    /*----Estados del formulario----*/
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [completado, setCompletado] = useState(false);


    /*----Enviamos la nueva contraseña al backend----*/
    const restablecerContrasena = async (e) => {

        e.preventDefault();

        setError("");
        setMensaje("");


        /*----Comprobamos que exista un token válido----*/
        if (!token || !/^[a-f0-9]{64}$/.test(token)) {

            setError("El enlace de recuperación no es válido");
            return;

        }


        /*----Comprobamos la longitud de la contraseña----*/
        if (
            nuevaContrasena.length < 8 ||
            new TextEncoder().encode(nuevaContrasena).length > 72
        ) {

            setError(
                "La contraseña debe tener al menos 8 caracteres y no superar los 72 bytes"
            );

            return;

        }


        /*----Comprobamos que las contraseñas coincidan----*/
        if (nuevaContrasena !== confirmarContrasena) {

            setError("Las contraseñas no coinciden");
            return;

        }


        setCargando(true);

        try {

            const respuesta = await fetch(
                "http://localhost:3000/usuarios/restablecer-contrasena",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token,
                        nuevaContrasena,
                        confirmarContrasena
                    })
                }
            );

            const datos = await respuesta.json();


            /*----Comprobamos la respuesta del servidor----*/
            if (!respuesta.ok) {

                setError(
                    datos.error || "No se ha podido restablecer la contraseña"
                );

                return;

            }


            /*----Mostramos el resultado y limpiamos las contraseñas----*/
            setMensaje(datos.mensaje);
            setNuevaContrasena("");
            setConfirmarContrasena("");
            setCompletado(true);

        } catch {

            setError("No se ha podido conectar con el servidor");

        } finally {

            setCargando(false);

        }

    };


    /*----Mostramos el formulario de restablecimiento----*/
    return (

        <section className="restablecer-contrasena">

            <h1>Restablecer contraseña</h1>

            {!token || !/^[a-f0-9]{64}$/.test(token) ? (

                <p role="alert">
                    El enlace de recuperación no es válido.
                </p>

            ) : !completado && (

                <form onSubmit={restablecerContrasena}>

                    <label htmlFor="nuevaContrasena">
                        Nueva contraseña
                    </label>

                    <input
                        id="nuevaContrasena"
                        type="password"
                        value={nuevaContrasena}
                        onChange={(e) => setNuevaContrasena(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={cargando}
                    />


                    <label htmlFor="confirmarContrasena">
                        Confirmar contraseña
                    </label>

                    <input
                        id="confirmarContrasena"
                        type="password"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={cargando}
                    />


                    <button type="submit" disabled={cargando}>

                        {cargando
                            ? "Guardando..."
                            : "Restablecer contraseña"}

                    </button>

                </form>

            )}


            {mensaje && <p role="status">{mensaje}</p>}

            {error && <p role="alert">{error}</p>}


            {!completado && (

                <p>
                    <Link to="/recuperar-contrasena">
                        Solicitar un nuevo enlace
                    </Link>
                </p>

            )}


            <Link to="/login">
                Volver a iniciar sesión
            </Link>

        </section>

    );

}


//=======EXPORTAMOS EL COMPONENTE=======//

export default RestablecerContrasena;