import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

function AdminGestionMensajes({ token }) {

    // ===== ESTADOS DEL COMPONENTE =====
    const [mensajes, setMensajes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [eliminando, setEliminando] = useState(null);


    // ===== OBTENER MENSAJES DEL BACKEND =====
    useEffect(() => {

        const controlador = new AbortController();

        const obtenerMensajes = async () => {

            try {

                const respuesta = await fetch(
                    `${API_URL}/mensajes`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        signal: controlador.signal
                    }
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron cargar los mensajes."
                    );
                }

                const datos = await respuesta.json();

                if (!Array.isArray(datos)) {
                    throw new Error(
                        "El listado de mensajes no es válido."
                    );
                }

                if (!controlador.signal.aborted) {
                    setMensajes(datos);
                    setError("");
                }

            } catch (error) {

                if (!controlador.signal.aborted) {
                    setError(error.message);
                }

            } finally {

                if (!controlador.signal.aborted) {
                    setCargando(false);
                }

            }

        };

        obtenerMensajes();

        return () => {
            controlador.abort();
        };

    }, [token]);


    // ===== ELIMINAR MENSAJE =====
    const eliminarMensaje = async (idMensaje) => {

        const confirmar = window.confirm(
            "¿Estás seguro de que quieres eliminar este mensaje?"
        );

        if (!confirmar) return;

        setError("");
        setConfirmacion("");
        setEliminando(idMensaje);

        try {

            const respuesta = await fetch(
                `${API_URL}/mensajes/${idMensaje}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo eliminar el mensaje."
                );
            }

            // Actualizamos el listado sin recargar la página.
            setMensajes((anteriores) =>
                anteriores.filter(
                    (mensaje) => mensaje.id_mensaje !== idMensaje
                )
            );

            setConfirmacion(
                "Mensaje eliminado correctamente."
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setEliminando(null);

        }

    };


    // ===== INTERFAZ DE GESTIÓN DE MENSAJES =====
    return (

        <section className="admin-gestion-mensajes">

            <h2>Gestión de mensajes</h2>

            <p>
                Consulta los mensajes recibidos desde el
                formulario de contacto de Hache Studio.
            </p>

            {/* ===== MENSAJES DE ESTADO ===== */}

            {cargando && (
                <p role="status">Cargando mensajes...</p>
            )}

            {error && (
                <p role="alert">{error}</p>
            )}

            {confirmacion && (
                <p role="status">{confirmacion}</p>
            )}


            {/* ===== LISTADO VACÍO ===== */}

            {!cargando && !error && mensajes.length === 0 && (
                <p>No hay mensajes recibidos.</p>
            )}


            {/* ===== LISTADO DE MENSAJES ===== */}

            {!cargando && mensajes.length > 0 && (

                <div className="admin-listado-mensajes">

                    {mensajes.map((mensaje) => (

                        <article
                            className="admin-mensaje"
                            key={mensaje.id_mensaje}
                        >

                            <h3>{mensaje.asunto}</h3>

                            <p>
                                <strong>Nombre: </strong>
                                {mensaje.nombre}
                            </p>

                            <p>
                                <strong>Correo electrónico: </strong>
                                {mensaje.email}
                            </p>

                            <p>
                                <strong>Mensaje:</strong>
                            </p>

                            <p>{mensaje.mensaje}</p>


                            {/* ===== RESPONDER AL MENSAJE ===== */}
                            <a
                                className="admin-responder-mensaje"
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(mensaje.email)}&su=${encodeURIComponent(`Re: ${mensaje.asunto}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Responder
                            </a>

                            <button
                                type="button"
                                disabled={eliminando !== null}
                                onClick={() =>
                                    eliminarMensaje(mensaje.id_mensaje)
                                }
                            >
                                {eliminando === mensaje.id_mensaje
                                    ? "Eliminando..."
                                    : "Eliminar mensaje"}
                            </button>

                        </article>

                    ))}

                </div>

            )}

        </section>

    );

}

export default AdminGestionMensajes;