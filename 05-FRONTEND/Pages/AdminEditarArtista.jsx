
import { useState, useEffect } from "react";

function AdminEditarArtista({ artista, token, onArtistaActualizado, onCancelar }) {

    // ===== DATOS DEL FORMULARIO =====
    const [especialidad, setEspecialidad] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // ===== ESTADOS =====
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // ===== CARGAR DATOS DEL ARTISTA =====
    useEffect(() => {

        if (!artista) return;

        setEspecialidad(artista.especialidad || "");
        setDescripcion(artista.descripcion || "");

        setError("");
        setMensaje("");

    }, [artista]);


    // ===== GUARDAR CAMBIOS =====
    const guardarCambios = async (evento) => {

        evento.preventDefault();

        if (guardando || !artista) return;

        setError("");
        setMensaje("");
        setGuardando(true);

        try {

            if (!token) {
                throw new Error(
                    "Debes iniciar sesión como administrador."
                );
            }

            const respuesta = await fetch(
                `http://localhost:3000/artistas/${artista.id_usuario}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        especialidad: especialidad.trim(),
                        descripcion: descripcion.trim()
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || "No se pudo actualizar el artista."
                );
            }

            setMensaje("Artista actualizado correctamente.");

            // ===== NOTIFICAR AL PANEL =====
            if (typeof onArtistaActualizado === "function") {
                onArtistaActualizado(datos);
            }

        } catch (errorActualizacion) {

            console.error(
                "Error al actualizar artista:",
                errorActualizacion
            );

            setError(errorActualizacion.message);

        } finally {

            setGuardando(false);

        }

    };


    // ===== FORMULARIO =====
    if (!artista) return null;

    return (

        <section className="admin-editar-artista">

            <h3>Editar artista: {artista.nombre}</h3>

            <form onSubmit={guardarCambios}>

                <div>
                    <label htmlFor="admin-editar-especialidad">
                        Especialidad
                    </label>

                    <input
                        id="admin-editar-especialidad"
                        type="text"
                        value={especialidad}
                        onChange={(evento) =>
                            setEspecialidad(evento.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="admin-editar-descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="admin-editar-descripcion"
                        value={descripcion}
                        onChange={(evento) =>
                            setDescripcion(evento.target.value)
                        }
                        rows={4}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={guardando}
                >
                    {guardando
                        ? "Guardando..."
                        : "Guardar cambios"}
                </button>

                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={guardando}
                >
                    Cancelar
                </button>

            </form>


            {/* ===== MENSAJES ===== */}
            {error && (
                <p role="alert">{error}</p>
            )}

            {mensaje && (
                <p role="status">{mensaje}</p>
            )}

        </section>

    );

}

export default AdminEditarArtista;

