
import { useEffect, useState } from "react";

import AdminCrearServicio from "./AdminCrearServicio";

import AdminEditarServicio from "./AdminEditarServicio";

import AdminDesactivarServicio from "./AdminDesactivarServicio";

function AdminGestionServicios({ token }) {

    // ===== ESTADOS =====
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // ===== ACTUALIZAR LISTADO =====
    const [recargarServicios, setRecargarServicios] = useState(0);

    // ===== SERVICIO SELECCIONADO PARA EDITAR =====
    const [servicioEditar, setServicioEditar] = useState(null);


    // ===== OBTENER SERVICIOS =====
    useEffect(() => {

        let cancelado = false;

        const obtenerServicios = async () => {

            setCargando(true);
            setError("");

            try {

                const respuesta = await fetch(
                    "http://localhost:3000/servicios"
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.error ||
                        "No se pudieron cargar los servicios."
                    );
                }

                if (!Array.isArray(datos)) {
                    throw new Error(
                        "El servidor no devolvió un listado válido."
                    );
                }

                if (!cancelado) {
                    setServicios(datos);
                }

            } catch (errorPeticion) {

                console.error(
                    "Error al obtener servicios:",
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

        obtenerServicios();

        return () => {
            cancelado = true;
        };

    }, [recargarServicios]);


    // ===== PANEL DE SERVICIOS =====
    return (

        <section className="admin-gestion-servicios">

            <h2>Gestión de servicios</h2>

            <p>
                Consulta y administra los servicios
                registrados en Hache Studio.
            </p>


            {/* ===== MENSAJE DE CARGA ===== */}
            {cargando && (
                <p>Cargando servicios...</p>
            )}


            {/* ===== MENSAJE DE ERROR ===== */}
            {error && (
                <p role="alert">{error}</p>
            )}


            {/* ===== LISTADO DE SERVICIOS ===== */}
            {!cargando && !error && (

                <div>

                    <h3>
                        Servicios encontrados: {servicios.length}
                    </h3>

                    {servicios.length === 0 ? (

                        <p>
                            No hay servicios registrados.
                        </p>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {servicios.map((servicio) => (

                                    <tr key={servicio.id_servicio}>

                                        <td>
                                            {servicio.id_servicio}
                                        </td>

                                        <td>
                                            {servicio.nombre}
                                        </td>

                                        <td>
                                            {servicio.descripcion || "Sin descripción"}
                                        </td>

                                        <td>
                                            {Number(servicio.precio).toFixed(2)} €
                                        </td>

                                        <td>
                                            {servicio.activo === false
                                                ? "Inactivo"
                                                : "Activo"}
                                        </td>


                                        {/* ===== BOTÓN EDITAR ===== */}
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => setServicioEditar(servicio)}
                                            >
                                                Editar
                                            </button>
                                            

                                            {/* ===== BOTÓN DESACTIVAR ===== */}
                                            <AdminDesactivarServicio
                                                servicio={servicio}
                                                token={token}
                                                onServicioDesactivado={() => {
                                                    setServicioEditar(null);
                                                    setRecargarServicios(
                                                        (anterior) => anterior + 1
                                                    );
                                                }}
                                            />
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            )}




            {/* ===== FORMULARIO PARA EDITAR SERVICIOS ===== */}
            {servicioEditar && (

                <AdminEditarServicio

                    key={servicioEditar.id_servicio}
                    servicio={servicioEditar}
                    token={token}
                    onServicioActualizado={() => {
                        setServicioEditar(null);
                        setRecargarServicios((anterior) => anterior + 1);
                    }}

                    onCancelar={() => {
                        setServicioEditar(null);

                    }}

                />
            )}


            {/* ===== FORMULARIO PARA CREAR SERVICIOS ===== */}
            <AdminCrearServicio
                token={token}
                onServicioCreado={() => {

                    setRecargarServicios(
                        (anterior) => anterior + 1
                    );

                }}
            />

        </section>

    );

}

export default AdminGestionServicios;
