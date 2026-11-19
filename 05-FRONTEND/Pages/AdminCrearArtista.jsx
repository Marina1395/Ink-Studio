
import { useState } from "react";

const API_URL = "http://localhost:3000";

function AdminCrearArtista({ token, onArtistaCreado }) {

    // ===== DATOS DEL FORMULARIO =====
    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        contrasena: "",
        especialidad: "",
        descripcion: ""
    });

    // ===== ESTADOS DEL REGISTRO =====
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // ===== ACTUALIZAR CAMPOS =====
    const actualizarCampo = (evento) => {

        const { name, value } = evento.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));

    };


    // ===== REGISTRAR ARTISTA =====
    const registrarArtista = async (evento) => {

        evento.preventDefault();

        if (guardando) return;

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
                `${API_URL}/artistas`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nombre: formulario.nombre.trim(),
                        email: formulario.email.trim(),
                        contrasena: formulario.contrasena,
                        especialidad: formulario.especialidad.trim(),
                        descripcion: formulario.descripcion.trim()
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || "No se pudo registrar el artista."
                );
            }

            setMensaje(
                datos.mensaje || "Artista registrado correctamente."
            );

            // ===== LIMPIAR FORMULARIO =====
            setFormulario({
                nombre: "",
                email: "",
                contrasena: "",
                especialidad: "",
                descripcion: ""
            });

            // ===== AVISAR AL PANEL =====
            if (typeof onArtistaCreado === "function") {
                onArtistaCreado();
            }

        } catch (errorRegistro) {

            console.error(
                "Error al registrar artista:",
                errorRegistro
            );

            setError(errorRegistro.message);

        } finally {

            setGuardando(false);

        }

    };


    // ===== FORMULARIO =====
    return (

        <section className="admin-crear-artista">

            <h3>Registrar nuevo artista</h3>

            <form onSubmit={registrarArtista}>

                <div>
                    <label htmlFor="admin-nombre">
                        Nombre
                    </label>

                    <input
                        id="admin-nombre"
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={actualizarCampo}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="admin-email">
                        Correo electrónico
                    </label>

                    <input
                        id="admin-email"
                        type="email"
                        name="email"
                        value={formulario.email}
                        onChange={actualizarCampo}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="admin-contrasena">
                        Contraseña
                    </label>

                    <input
                        id="admin-contrasena"
                        type="password"
                        name="contrasena"
                        value={formulario.contrasena}
                        onChange={actualizarCampo}
                        minLength={8}
                        maxLength={72}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="admin-especialidad">
                        Especialidad
                    </label>

                    <input
                        id="admin-especialidad"
                        type="text"
                        name="especialidad"
                        value={formulario.especialidad}
                        onChange={actualizarCampo}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="admin-descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="admin-descripcion"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={actualizarCampo}
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    disabled={guardando}
                >
                    {guardando
                        ? "Registrando..."
                        : "Registrar artista"}
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

export default AdminCrearArtista;
