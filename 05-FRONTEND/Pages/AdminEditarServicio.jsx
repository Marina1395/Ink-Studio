
import { useState } from "react";


function AdminEditarServicio({
    servicio,
    token,
    onServicioActualizado,
    onCancelar
}) {

    // ===== DATOS DEL SERVICIO =====
    const [nombre, setNombre] = useState(servicio.nombre);
    const [descripcion, setDescripcion] = useState(servicio.descripcion ?? "");
    const [precio, setPrecio] = useState(String(servicio.precio));

    // ===== ESTADOS DE CONTROL =====
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // ===== ACTUALIZAR SERVICIO =====
    const actualizarServicio = async (e) => {

        e.preventDefault();
        setError("");

        // Validar nombre y descripción
        if (!nombre.trim() || !descripcion.trim()) {
            setError("El nombre y la descripción son obligatorios.");
            return;
        }

        // Validar precio
        const precioNumero = Number(precio);

        if (
            precio.trim() === "" ||
            !Number.isFinite(precioNumero) ||
            precioNumero < 0
        ) {
            setError("Introduce un precio válido.");
            return;
        }

        // Comprobar autenticación
        if (!token) {
            setError("Debes iniciar sesión como administrador.");
            return;
        }

        setGuardando(true);

        try {

            const respuesta = await fetch(
                `http://localhost:3000/servicios/${servicio.id_servicio}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        descripcion: descripcion.trim(),
                        precio: precioNumero
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || "No se pudo actualizar el servicio."
                );
            }

            // Avisar al componente padre
            if (onServicioActualizado) {
                onServicioActualizado();
            }

        } catch (errorPeticion) {

            console.error(
                "Error al actualizar el servicio:",
                errorPeticion
            );

            setError(errorPeticion.message);

        } finally {

            setGuardando(false);

        }

    };

    // ===== FORMULARIO DE EDICIÓN =====
    return (

        <section className="admin-editar-servicio">

            <h3>
                Editar servicio #{servicio.id_servicio}
            </h3>

            <form onSubmit={actualizarServicio}>

                {/* ===== NOMBRE ===== */}
                <div>

                    <label htmlFor="editar-servicio-nombre">
                        Nombre del servicio
                    </label>

                    <input
                        id="editar-servicio-nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                </div>

                {/* ===== DESCRIPCIÓN ===== */}
                <div>

                    <label htmlFor="editar-servicio-descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="editar-servicio-descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />

                </div>

                {/* ===== PRECIO ===== */}
                <div>

                    <label htmlFor="editar-servicio-precio">
                        Precio (€)
                    </label>

                    <input
                        id="editar-servicio-precio"
                        type="number"
                        min="0"
                        step="0.01"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />

                </div>

                {/* ===== ERROR ===== */}
                {error && (
                    <p role="alert">{error}</p>
                )}

                {/* ===== BOTONES ===== */}
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

        </section>

    );

}

export default AdminEditarServicio;
