
import { useState } from "react";

function AdminCrearServicio({ token, onServicioCreado }) {

    // ===== ESTADOS DEL FORMULARIO =====
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");

    // ===== ESTADOS DE CONTROL =====
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    // ===== CREAR SERVICIO =====
    const crearServicio = async (e) => {

        e.preventDefault();

        setError("");
        setMensaje("");

        // Comprobamos los campos obligatorios
        if (!nombre.trim() || !descripcion.trim()) {
            setError("El nombre y la descripción son obligatorios.");
            return;
        }

        // Comprobamos el precio
        const precioNumero = Number(precio);

        if (
            precio.trim() === "" ||
            !Number.isFinite(precioNumero) ||
            precioNumero < 0
        ) {
            setError("Introduce un precio válido.");
            return;
        }

        // Comprobamos que exista una sesión
        if (!token) {
            setError("Debes iniciar sesión como administrador.");
            return;
        }

        setGuardando(true);

        try {

            const respuesta = await fetch(
                "http://localhost:3000/servicios",
                {
                    method: "POST",

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
                    datos.error || "No se pudo crear el servicio."
                );
            }

            // Limpiamos el formulario
            setNombre("");
            setDescripcion("");
            setPrecio("");

            setMensaje("Servicio creado correctamente.");

            // Avisamos al componente padre
            if (onServicioCreado) {
                onServicioCreado();
            }

        } catch (errorPeticion) {

            console.error(
                "Error al crear el servicio:",
                errorPeticion
            );

            setError(errorPeticion.message);

        } finally {

            setGuardando(false);

        }

    };

    // ===== FORMULARIO =====
    return (

        <section className="admin-crear-servicio">

            <h3>Crear nuevo servicio</h3>

            <form onSubmit={crearServicio}>

                {/* ===== NOMBRE ===== */}
                <div>

                    <label htmlFor="crear-servicio-nombre">
                        Nombre del servicio
                    </label>

                    <input
                        id="crear-servicio-nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                </div>

                {/* ===== DESCRIPCIÓN ===== */}
                <div>

                    <label htmlFor="crear-servicio-descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="crear-servicio-descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />

                </div>

                {/* ===== PRECIO ===== */}
                <div>

                    <label htmlFor="crear-servicio-precio">
                        Precio (€)
                    </label>

                    <input
                        id="crear-servicio-precio"
                        type="number"
                        min="0"
                        step="0.01"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />

                </div>

                {/* ===== MENSAJES ===== */}
                {error && (
                    <p role="alert">{error}</p>
                )}

                {mensaje && (
                    <p role="status">{mensaje}</p>
                )}

                {/* ===== BOTÓN ===== */}
                <button
                    type="submit"
                    disabled={guardando}
                >
                    {guardando
                        ? "Creando servicio..."
                        : "Crear servicio"}
                </button>

            </form>

        </section>

    );

}

export default AdminCrearServicio;
