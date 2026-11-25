/*----Importamos useState de React----*/
import { useState } from "react";


// ===== COMPONENTE PARA EDITAR USUARIOS =====

function AdminEditarUsuario({
    token,
    usuario,
    onUsuarioActualizado,
    onCancelar
}) {

    // ===== ESTADOS =====

    const [nombre, setNombre] = useState(usuario.nombre);
    const [email, setEmail] = useState(usuario.email);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");


    // ===== ACTUALIZAR USUARIO =====

    const actualizarUsuario = async (evento) => {

        /*----Evitamos que se recargue la página----*/
        evento.preventDefault();

        setError("");


        // ===== VALIDACIONES =====

        if (
            nombre.trim().length < 2 ||
            nombre.trim().length > 100
        ) {

            setError("El nombre debe tener entre 2 y 100 caracteres.");
            return;

        }

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email.trim())) {

            setError("Introduce un correo electrónico válido.");
            return;

        }

        setGuardando(true);


        // ===== PETICIÓN AL BACKEND =====

        try {

            const respuesta = await fetch(
                `http://localhost:3000/usuarios/${usuario.id_usuario}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        email: email.trim().toLowerCase()
                    })
                }
            );

            const datos = await respuesta.json();


            /*----Comprobamos si la actualización ha sido correcta----*/

            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo actualizar el usuario."
                );

            }


            /*----Avisamos al componente padre de la actualización----*/

            onUsuarioActualizado(datos);


        } catch (error) {

            console.error("Error al actualizar el usuario:", error);

            setError(error.message);

        } finally {

            setGuardando(false);

        }

    };


    // ===== FORMULARIO DE EDICIÓN =====

    return (

        <section className="admin-editar-usuario">

            <h3>Editar usuario</h3>

            <form onSubmit={actualizarUsuario}>


                {/* ===== NOMBRE ===== */}

                <label htmlFor="editar-nombre">
                    Nombre
                </label>

                <input
                    id="editar-nombre"
                    type="text"
                    value={nombre}
                    onChange={(evento) =>
                        setNombre(evento.target.value)
                    }
                    required
                    maxLength={100}
                />


                {/* ===== CORREO ELECTRÓNICO ===== */}

                <label htmlFor="editar-email">
                    Correo electrónico
                </label>

                <input
                    id="editar-email"
                    type="email"
                    value={email}
                    onChange={(evento) =>
                        setEmail(evento.target.value)
                    }
                    required
                />


                {/* ===== ROL DEL USUARIO ===== */}

                <label htmlFor="editar-rol">
                    Rol
                </label>

                <input
                    id="editar-rol"
                    type="text"
                    value={usuario.rol}
                    readOnly
                />


                {/* ===== MENSAJE DE ERROR ===== */}

                {error && (
                    <p role="alert">{error}</p>
                )}


                {/* ===== BOTONES DEL FORMULARIO ===== */}

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


// ===== EXPORTAMOS EL COMPONENTE =====

export default AdminEditarUsuario;