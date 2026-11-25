/*----Importamos los hooks de React----*/
import { useState, useEffect } from "react";

/*----Importamos el formulario de edición de usuarios----*/
import AdminEditarUsuario from "./AdminEditarUsuario";


/*----Componente para gestionar los usuarios----*/
function AdminGestionUsuarios({ token }) {

    // ===== ESTADOS =====

    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [usuarioEditar, setUsuarioEditar] = useState(null);

    /*----Estados para gestionar la baja de usuarios----*/
    const [usuarioProcesando, setUsuarioProcesando] = useState(null);
    const [errorOperacion, setErrorOperacion] = useState("");
    const [mensaje, setMensaje] = useState("");


    // ===== OBTENER USUARIOS DEL BACKEND =====

    useEffect(() => {

        const obtenerUsuarios = async () => {

            setCargando(true);
            setError("");

            try {

                /*----Comprobamos que exista un token----*/
                if (!token) {

                    throw new Error(
                        "Debes iniciar sesión como administrador."
                    );

                }

                /*----Solicitamos los usuarios al backend----*/
                const respuesta = await fetch(
                    "http://localhost:3000/usuarios",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                /*----Convertimos la respuesta a JSON----*/
                const datos = await respuesta.json();

                /*----Comprobamos que la petición sea correcta----*/
                if (!respuesta.ok) {

                    throw new Error(
                        datos.error ||
                        "No se pudieron cargar los usuarios."
                    );

                }

                /*----Comprobamos que recibimos un listado válido----*/
                if (!Array.isArray(datos)) {

                    throw new Error(
                        "El listado de usuarios no es válido."
                    );

                }

                /*----Guardamos los usuarios recibidos----*/
                setUsuarios(datos);

            } catch (error) {

                console.error(
                    "Error al obtener usuarios:",
                    error
                );

                setError(error.message);

            } finally {

                setCargando(false);

            }

        };

        obtenerUsuarios();

    }, [token]);


    // ===== ACTUALIZAR EL LISTADO DE USUARIOS =====

    const actualizarListado = (usuarioActualizado) => {

        /*----Sustituimos los datos antiguos por los actualizados----*/

        setUsuarios((usuariosAnteriores) =>

            usuariosAnteriores.map((usuario) =>

                usuario.id_usuario === usuarioActualizado.id_usuario

                    ? usuarioActualizado

                    : usuario

            )

        );

        /*----Cerramos el formulario de edición----*/
        setUsuarioEditar(null);

    };


    // ===== DAR DE BAJA A UN USUARIO =====

    const darDeBajaUsuario = async (usuario) => {

        /*----Limpiamos los mensajes anteriores----*/
        setErrorOperacion("");
        setMensaje("");

        /*----Comprobamos que no exista otra operación en curso----*/
        if (usuarioProcesando !== null || usuarioEditar !== null) {

            return;

        }

        /*----Comprobamos que exista un token----*/
        if (!token) {

            setErrorOperacion(
                "Debes iniciar sesión como administrador."
            );

            return;

        }

        /*----Solo permitimos dar de baja clientes----*/
        if (usuario.rol !== "cliente") {

            setErrorOperacion(
                "Desde este apartado solo se pueden dar de baja clientes."
            );

            return;

        }

        /*----Comprobamos que el cliente esté activo----*/
        if (usuario.activo !== true) {

            setErrorOperacion(
                "El usuario ya está dado de baja."
            );

            return;

        }

        /*----Solicitamos confirmación al administrador----*/
        const confirmar = window.confirm(
            `¿Estás seguro de que quieres dar de baja a ${usuario.nombre}? ` +
            "El cliente no podrá volver a iniciar sesión."
        );

        if (!confirmar) {

            return;

        }

        /*----Indicamos qué usuario estamos procesando----*/
        setUsuarioProcesando(usuario.id_usuario);

        try {

            /*----Enviamos la petición de baja al backend----*/
            const respuesta = await fetch(
                `http://localhost:3000/usuarios/${usuario.id_usuario}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            /*----Convertimos la respuesta a JSON----*/
            const datos = await respuesta.json();

            /*----Comprobamos el resultado de la operación----*/
            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo dar de baja al usuario."
                );

            }

            /*----Comprobamos los datos del usuario actualizado----*/
            if (
                !datos.usuario ||
                datos.usuario.id_usuario !== usuario.id_usuario ||
                datos.usuario.activo !== false
            ) {

                throw new Error(
                    "La respuesta del servidor no es válida. Recarga el listado."
                );

            }

            /*----Actualizamos el listado sin eliminar el usuario----*/
            actualizarListado(datos.usuario);

            /*----Mostramos el mensaje de confirmación----*/
            setMensaje(
                datos.mensaje ||
                "Usuario dado de baja correctamente."
            );

        } catch (error) {

            console.error(
                "Error al dar de baja al usuario:",
                error
            );

            setErrorOperacion(error.message);

        } finally {

            /*----Finalizamos la operación----*/
            setUsuarioProcesando(null);

        }

    };


    // ===== PANEL DE GESTIÓN DE USUARIOS =====

    return (

        <section className="admin-gestion-usuarios">

            <h2>Gestión de usuarios</h2>

            <p>
                Consulta, modifica y gestiona las bajas de las
                cuentas registradas en Hache Studio.
            </p>


            {/* ===== MENSAJE DE CARGA ===== */}

            {cargando && (
                <p>Cargando usuarios...</p>
            )}


            {/* ===== ERROR DE CARGA ===== */}

            {error && (
                <p role="alert">{error}</p>
            )}


            {/* ===== ERROR DE OPERACIÓN ===== */}

            {errorOperacion && (
                <p role="alert">{errorOperacion}</p>
            )}


            {/* ===== MENSAJE DE CONFIRMACIÓN ===== */}

            {mensaje && (
                <p role="status">{mensaje}</p>
            )}


            {/* ===== FORMULARIO DE EDICIÓN ===== */}

            {usuarioEditar && (

                <AdminEditarUsuario
                    key={usuarioEditar.id_usuario}
                    token={token}
                    usuario={usuarioEditar}
                    onUsuarioActualizado={actualizarListado}
                    onCancelar={() => setUsuarioEditar(null)}
                />

            )}


            {/* ===== LISTADO DE USUARIOS ===== */}

            {!cargando && !error && (

                <div>

                    <h3>
                        Usuarios registrados: {usuarios.length}
                    </h3>

                    {usuarios.length === 0 ? (

                        <p>No hay usuarios registrados.</p>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo electrónico</th>
                                    <th>Rol</th>
                                    <th>Estado de cuenta</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {usuarios.map((usuario) => (

                                    <tr key={usuario.id_usuario}>

                                        <td>
                                            {usuario.id_usuario}
                                        </td>

                                        <td>
                                            {usuario.nombre}
                                        </td>

                                        <td>
                                            {usuario.email}
                                        </td>

                                        <td>
                                            {usuario.rol}
                                        </td>

                                        {/*----Estado de la cuenta----*/}

                                        <td>

                                            {usuario.rol === "artista"

                                                ? "Gestionar en artistas"

                                                : usuario.activo === true

                                                    ? "Activo"

                                                    : usuario.activo === false

                                                        ? "Desactivado"

                                                        : "No disponible"}

                                        </td>

                                        <td>

                                            {/*----Botón de edición----*/}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setErrorOperacion("");
                                                    setMensaje("");
                                                    setUsuarioEditar(usuario);

                                                }}
                                                disabled={
                                                    usuarioEditar !== null ||
                                                    usuarioProcesando !== null
                                                }
                                            >
                                                Editar
                                            </button>


                                            {/*----Baja exclusiva de clientes activos----*/}

                                            {usuario.rol === "cliente" &&
                                                usuario.activo === true && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            darDeBajaUsuario(usuario)
                                                        }
                                                        disabled={
                                                            usuarioEditar !== null ||
                                                            usuarioProcesando !== null
                                                        }
                                                    >

                                                        {usuarioProcesando === usuario.id_usuario

                                                            ? "Procesando..."

                                                            : "Dar de baja"}

                                                    </button>

                                                )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            )}

        </section>

    );

}


// ===== EXPORTAR COMPONENTE =====

export default AdminGestionUsuarios;