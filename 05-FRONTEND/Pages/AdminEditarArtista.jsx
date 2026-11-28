import { useState } from "react";


// ===== COMPONENTE PARA EDITAR ARTISTAS =====
function AdminEditarArtista({
    artista,
    token,
    onArtistaActualizado,
    onCancelar
}) {

    /*----Comprobamos que existe un artista seleccionado----*/
    if (!artista) return null;

    /*----Reiniciamos el formulario al seleccionar otro artista----*/
    return (

        <FormularioEditarArtista
            key={artista.id_usuario}
            artista={artista}
            token={token}
            onArtistaActualizado={onArtistaActualizado}
            onCancelar={onCancelar}
        />

    );

}


// ===== FORMULARIO INTERNO DE EDICIÓN =====
function FormularioEditarArtista({
    artista,
    token,
    onArtistaActualizado,
    onCancelar
}) {

    // ===== DATOS DEL FORMULARIO =====

    /*----Inicializamos los estados con los datos del artista----*/
    const [especialidad, setEspecialidad] = useState(
        artista.especialidad || ""
    );

    const [descripcion, setDescripcion] = useState(
        artista.descripcion || ""
    );


    // ===== ESTADOS =====
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


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