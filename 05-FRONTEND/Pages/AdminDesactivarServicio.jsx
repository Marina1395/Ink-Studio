
import { useState } from "react";

function AdminDesactivarServicio({
    servicio,
    token,
    onServicioDesactivado
}) {

    // ===== ESTADOS =====
    const [desactivando, setDesactivando] = useState(false);
    const [error, setError] = useState("");

    // ===== DESACTIVAR SERVICIO =====
    const desactivarServicio = async () => {

        setError("");

        // ===== CONFIRMACIÓN =====
        const confirmado = window.confirm(
            `¿Seguro que quieres desactivar el servicio "${servicio.nombre}"?`
        );

        if (!confirmado) {
            return;
        }

        // ===== COMPROBAR AUTENTICACIÓN =====
        if (!token) {
            setError("Debes iniciar sesión como administrador.");
            return;
        }

        setDesactivando(true);

        try {

            const respuesta = await fetch(
                `http://localhost:3000/servicios/${servicio.id_servicio}`,
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
                    datos.error || "No se pudo desactivar el servicio."
                );
            }

            // ===== ACTUALIZAR LISTADO =====
            if (onServicioDesactivado) {
                onServicioDesactivado();
            }

        } catch (errorPeticion) {

            console.error(
                "Error al desactivar el servicio:",
                errorPeticion
            );

            setError(errorPeticion.message);

        } finally {

            setDesactivando(false);

        }

    };

    // ===== BOTÓN DE DESACTIVACIÓN =====
    return (

        <div className="admin-desactivar-servicio">

            <button
                type="button"
                onClick={desactivarServicio}
                disabled={desactivando || servicio.activo === false}
            >
                {desactivando
                    ? "Desactivando..."
                    : servicio.activo === false
                        ? "Inactivo"
                        : "Desactivar"}
            </button>

            {error && (
                <p role="alert">{error}</p>
            )}

        </div>

    );

}

export default AdminDesactivarServicio;
