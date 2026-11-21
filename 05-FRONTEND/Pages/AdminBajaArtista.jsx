
import { useState } from "react";

function AdminBajaArtista({ artista, token, onArtistaDesactivado }) {

    // ===== ESTADOS =====
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState("");

    // ===== DAR DE BAJA AL ARTISTA =====
    const darDeBaja = async () => {

        if (procesando || !artista) return;

        // Confirmar antes de modificar el estado
        const confirmado = window.confirm(
            `¿Seguro que quieres dar de baja a ${artista.nombre}?\n\n` +
            "El artista dejará de estar disponible para nuevas reservas."
        );

        if (!confirmado) return;

        setError("");
        setProcesando(true);

        try {

            if (!token) {
                throw new Error(
                    "Debes iniciar sesión como administrador."
                );
            }

            const respuesta = await fetch(
                `http://localhost:3000/artistas/${artista.id_usuario}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error ||
                    "No se pudo dar de baja al artista."
                );
            }

            // Avisar al panel para actualizar el listado
            if (typeof onArtistaDesactivado === "function") {
                onArtistaDesactivado(datos);
            }

        } catch (errorBaja) {

            console.error(
                "Error al dar de baja al artista:",
                errorBaja
            );

            setError(errorBaja.message);

        } finally {

            setProcesando(false);

        }

    };


    // ===== BOTÓN DE BAJA =====
    if (!artista || artista.activo === false) {
        return null;
    }

    return (
        <span className="admin-baja-artista">

            <button
                type="button"
                onClick={darDeBaja}
                disabled={procesando}
            >
                {procesando
                    ? "Procesando..."
                    : "Dar de baja"}
            </button>

            {error && (
                <span role="alert">
                    {" "}{error}
                </span>
            )}

        </span>
    );

}

export default AdminBajaArtista;
