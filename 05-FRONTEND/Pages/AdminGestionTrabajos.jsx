/*----Importamos los hooks de React----*/
import { useState, useEffect } from "react";


/*----Importamos los componentes de gestión de trabajos----*/
import AdminCrearTrabajo from "./AdminCrearTrabajo";
import AdminEditarTrabajo from "./AdminEditarTrabajo";
import AdminEliminarTrabajo from "./AdminEliminarTrabajo";


/*----Componente para gestionar los trabajos----*/
function AdminGestionTrabajos({ token }) {

    // ===== ESTADOS =====

    const [trabajos, setTrabajos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    /*----Controlamos la apertura del formulario de registro----*/
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    /*----Mensaje de operación correcta----*/
    const [mensaje, setMensaje] = useState("");

    /*----Trabajo seleccionado para editar----*/
    const [trabajoEditar, setTrabajoEditar] = useState(null);


    // ===== OBTENER TRABAJOS DEL BACKEND =====

    useEffect(() => {

        const obtenerTrabajos = async () => {

            setCargando(true);
            setError("");

            try {

                /*----Comprobamos que exista un token----*/
                if (!token) {

                    throw new Error(
                        "Debes iniciar sesión como administrador."
                    );

                }

                /*----Solicitamos los trabajos al backend----*/
                const respuesta = await fetch(
                    "http://localhost:3000/trabajos",
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
                        "No se pudieron cargar los trabajos."
                    );

                }

                /*----Comprobamos que recibimos un listado válido----*/
                if (!Array.isArray(datos)) {

                    throw new Error(
                        "El listado de trabajos no es válido."
                    );

                }

                /*----Guardamos los trabajos recibidos----*/
                setTrabajos(datos);

            } catch (error) {

                console.error(
                    "Error al obtener los trabajos:",
                    error
                );

                setError(error.message);

            } finally {

                setCargando(false);

            }

        };

        obtenerTrabajos();

    }, [token]);


    // ===== ACTUALIZAR LISTADO TRAS CREAR UN TRABAJO =====

    const trabajoCreado = (nuevoTrabajo) => {

        /*----Añadimos el nuevo trabajo al listado----*/
        setTrabajos((trabajosAnteriores) => [
            ...trabajosAnteriores,
            nuevoTrabajo
        ]);

        /*----Cerramos el formulario----*/
        setMostrarFormulario(false);

        /*----Mostramos el mensaje de confirmación----*/
        setMensaje("Trabajo registrado correctamente");

    };


    // ===== ACTUALIZAR LISTADO TRAS EDITAR UN TRABAJO =====

    const trabajoActualizado = (trabajoModificado) => {

        /*----Sustituimos los datos antiguos por los actualizados----*/

        setTrabajos((trabajosAnteriores) =>

            trabajosAnteriores.map((trabajo) =>

                trabajo.id_trabajo === trabajoModificado.id_trabajo

                    ? trabajoModificado

                    : trabajo

            )

        );

        /*----Cerramos el formulario de edición----*/
        setTrabajoEditar(null);

        /*----Mostramos el mensaje de confirmación----*/
        setMensaje("Trabajo actualizado correctamente");

    };


    // ===== ACTUALIZAR LISTADO TRAS ELIMINAR UN TRABAJO =====

    const trabajoEliminado = (idTrabajoEliminado) => {

        /*----Retiramos el trabajo eliminado del listado----*/

        setTrabajos((trabajosAnteriores) =>

            trabajosAnteriores.filter((trabajo) =>

                trabajo.id_trabajo !== idTrabajoEliminado

            )

        );

        /*----Mostramos el mensaje de confirmación----*/
        setMensaje("Trabajo eliminado correctamente");

    };


    // ===== PANEL DE GESTIÓN DE TRABAJOS =====

    return (

        <section className="admin-gestion-trabajos">

            <h2>Gestión de trabajos</h2>

            <p>
                Gestiona los trabajos realizados por los
                artistas de Hache Studio.
            </p>


            {/* ===== MENSAJE DE OPERACIÓN CORRECTA ===== */}

            {mensaje && (
                <p role="status">{mensaje}</p>
            )}


            {/* ===== BOTÓN PARA REGISTRAR TRABAJOS ===== */}

            <button
                type="button"
                onClick={() => {

                    setMostrarFormulario(true);
                    setMensaje("");

                }}
                disabled={
                    mostrarFormulario ||
                    trabajoEditar !== null ||
                    cargando ||
                    !!error
                }
            >
                Registrar nuevo trabajo
            </button>


            {/* ===== FORMULARIO DE REGISTRO ===== */}

            {mostrarFormulario && (

                <AdminCrearTrabajo
                    token={token}
                    onTrabajoCreado={trabajoCreado}
                    onCancelar={() => setMostrarFormulario(false)}
                />

            )}


            {/* ===== FORMULARIO DE EDICIÓN ===== */}

            {trabajoEditar && (

                <AdminEditarTrabajo
                    key={trabajoEditar.id_trabajo}
                    token={token}
                    trabajo={trabajoEditar}
                    onTrabajoActualizado={trabajoActualizado}
                    onCancelar={() => setTrabajoEditar(null)}
                />

            )}


            {/* ===== MENSAJE DE CARGA ===== */}

            {cargando && (
                <p>Cargando trabajos...</p>
            )}


            {/* ===== MENSAJE DE ERROR ===== */}

            {error && (
                <p role="alert">{error}</p>
            )}


            {/* ===== LISTADO DE TRABAJOS ===== */}

            {!cargando && !error && (

                <div>

                    <h3>
                        Trabajos registrados: {trabajos.length}
                    </h3>

                    {trabajos.length === 0 ? (

                        <p>No hay trabajos registrados.</p>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Artista (ID)</th>
                                    <th>Título</th>
                                    <th>Descripción</th>
                                    <th>Imagen</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {trabajos.map((trabajo) => (

                                    <tr key={trabajo.id_trabajo}>

                                        <td>
                                            {trabajo.id_trabajo}
                                        </td>

                                        <td>
                                            {trabajo.id_artista}
                                        </td>

                                        <td>
                                            {trabajo.titulo}
                                        </td>

                                        <td>
                                            {trabajo.descripcion}
                                        </td>

                                        <td>
                                            {trabajo.imagen || "Sin imagen"}
                                        </td>


                                        {/* ===== ACCIONES DEL TRABAJO ===== */}

                                        <td>

                                            {/*----Editar trabajo----*/}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setTrabajoEditar(trabajo);
                                                    setMensaje("");

                                                }}
                                                disabled={
                                                    mostrarFormulario ||
                                                    trabajoEditar !== null
                                                }
                                            >
                                                Editar
                                            </button>


                                            {" "}


                                            {/*----Eliminar trabajo----*/}

                                            {!mostrarFormulario &&
                                                trabajoEditar === null && (

                                                    <AdminEliminarTrabajo
                                                        token={token}
                                                        trabajo={trabajo}
                                                        onTrabajoEliminado={
                                                            trabajoEliminado
                                                        }
                                                    />

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

export default AdminGestionTrabajos;