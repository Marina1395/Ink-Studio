
import { useState, useEffect } from "react";
import AdminEditarCita from "./AdminEditarCita";

function AdminGestionCitas({ token }) {

    // ===== ESTADOS =====
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todas");

    // ===== EDICIÓN DE CITAS =====
    const [citaEditar, setCitaEditar] = useState(null);
    const [recargarCitas, setRecargarCitas] = useState(0);

    // ===== OBTENER TODAS LAS CITAS =====
    useEffect(() => {

        let cancelado = false;

        const obtenerCitas = async () => {

            setCargando(true);
            setError("");

            try {

                if (!token) {
                    throw new Error(
                        "Debes iniciar sesión como administrador."
                    );
                }

                const respuesta = await fetch(
                    "http://localhost:3000/citas",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.error ||
                        "No se pudieron cargar las citas."
                    );
                }

                if (!Array.isArray(datos)) {
                    throw new Error(
                        "El servidor no ha devuelto un listado válido."
                    );
                }

                if (!cancelado) {
                    setCitas(datos);
                }

            } catch (errorPeticion) {

                console.error(
                    "Error al obtener las citas:",
                    errorPeticion
                );

                if (!cancelado) {
                    setError(errorPeticion.message);
                }

            } finally {

                if (!cancelado) {
                    setCargando(false);
                }

            }

        };

        obtenerCitas();

        return () => {
            cancelado = true;
        };

    }, [token, recargarCitas]);


    // ===== FILTRAR CITAS POR ESTADO =====
    const citasFiltradas = citas.filter((cita) => {

        if (filtroEstado === "todas") {
            return true;
        }

        return cita.estado === filtroEstado;

    });


    // ===== FORMATEAR FECHA =====
    const formatearFecha = (fecha) => {

        if (!fecha) return "Sin fecha";

        const fechaTexto = String(fecha).slice(0, 10);
        const partes = fechaTexto.split("-");

        if (partes.length !== 3) {
            return fechaTexto;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    };


    // ===== FORMATEAR HORA =====
    const formatearHora = (hora) => {

        if (!hora) return "Sin hora";

        return String(hora).slice(0, 5);

    };


    // ===== PANEL DE GESTIÓN DE CITAS =====
    return (

        <section className="admin-gestion-citas">

            <h2>Gestión de citas</h2>

            <p>
                Consulta todas las reservas registradas
                en Hache Studio.
            </p>


            {/* ===== FILTRO POR ESTADO ===== */}
            <div>

                <label htmlFor="filtro-estado-citas">
                    Filtrar por estado:{" "}
                </label>

                <select
                    id="filtro-estado-citas"
                    value={filtroEstado}
                    onChange={(e) =>
                        setFiltroEstado(e.target.value)
                    }
                >

                    <option value="todas">
                        Todas las citas
                    </option>

                    <option value="pendiente">
                        Pendientes
                    </option>

                    <option value="confirmada">
                        Confirmadas
                    </option>

                    <option value="cancelada">
                        Canceladas
                    </option>

                </select>

            </div>


            {/* ===== MENSAJES ===== */}
            {cargando && (
                <p>Cargando citas...</p>
            )}

            {error && (
                <p role="alert">{error}</p>
            )}


            {/* ===== LISTADO DE CITAS ===== */}
            {!cargando && !error && (

                <div>

                    <h3>
                        Citas encontradas: {citasFiltradas.length}
                    </h3>

                    {citasFiltradas.length === 0 ? (

                        <p>
                            No hay citas que coincidan
                            con el filtro seleccionado.
                        </p>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Artista</th>
                                    <th>Servicio</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Estado</th>
                                    <th>Duración</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {citasFiltradas.map((cita) => (

                                    <tr key={cita.id_cita}>

                                        <td>
                                            {cita.id_cita}
                                        </td>

                                        <td>
                                            {cita.nombre_cliente || "Sin nombre"}
                                        </td>

                                        <td>
                                            {cita.nombre_artista || "Sin nombre"}
                                        </td>

                                        <td>
                                            {cita.nombre_servicio || "Sin servicio"}
                                        </td>

                                        <td>
                                            {formatearFecha(cita.fecha)}
                                        </td>

                                        <td>
                                            {formatearHora(cita.hora)}
                                        </td>

                                        <td>
                                            {cita.estado}
                                        </td>

                                        <td>
                                            {cita.duracion_minutos != null
                                                ? `${cita.duracion_minutos} min`
                                                : "Sin asignar"}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => setCitaEditar(cita)}
                                            >
                                                Editar
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            )}

            {/* ===== FORMULARIO PARA EDITAR CITA ===== */}
            {citaEditar && (

                <AdminEditarCita
                    cita={citaEditar}
                    token={token}

                    onCitaActualizada={() => {

                        setCitaEditar(null);

                        setRecargarCitas(
                            (anterior) => anterior + 1
                        );

                    }}

                    onCancelar={() => {
                        setCitaEditar(null);
                    }}
                />

            )}

        </section>

    );

}

export default AdminGestionCitas;


