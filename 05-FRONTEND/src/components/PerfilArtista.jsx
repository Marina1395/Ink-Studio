import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000";

// ===== PERFIL DE UN ARTISTA =====
function PerfilArtista({ artistas, token, usuario }) {

    const { id } = useParams();

    const artista = artistas.find(
        (profesional) => profesional.id_usuario === Number(id)
    );

    // ===== ESTADOS DE LA RESERVA =====
    const [fecha, setFecha] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState("");

    const [cargandoHorarios, setCargandoHorarios] = useState(false);
    const [errorHorarios, setErrorHorarios] = useState("");
    const [fechaConsultada, setFechaConsultada] = useState(false);

    // Servicios que existen en PostgreSQL
    const [servicios, setServicios] = useState([]);
    const [idServicio, setIdServicio] = useState("");

    // Estado del envío de la solicitud
    const [enviandoCita, setEnviandoCita] = useState(false);
    const [errorCita, setErrorCita] = useState("");
    const [mensajeCita, setMensajeCita] = useState("");

    // ===== ESTADOS DE LOS TRABAJOS DEL ARTISTA =====

    const [trabajos, setTrabajos] = useState([]);
    const [cargandoTrabajos, setCargandoTrabajos] = useState(true);
    const [errorTrabajos, setErrorTrabajos] = useState("");

    // ===== CARGAR TRABAJOS DEL ARTISTA =====

    useEffect(() => {

        let activo = true;

        const obtenerTrabajos = async () => {

            setCargandoTrabajos(true);
            setErrorTrabajos("");
            setTrabajos([]);

            try {

                const respuesta = await fetch(
                    `${API_URL}/trabajos`
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron cargar los trabajos."
                    );
                }

                const datos = await respuesta.json();

                // Seleccionamos únicamente los trabajos
                // del artista cuyo perfil estamos visitando.

                const trabajosArtista = datos.filter(
                    (trabajo) =>
                        trabajo.id_artista === Number(id) &&
                        trabajo.imagen
                );

                if (activo) {
                    setTrabajos(trabajosArtista);
                }

            } catch (error) {

                console.error("Error al cargar trabajos:", error);

                if (activo) {
                    setErrorTrabajos(error.message);
                }

            } finally {

                if (activo) {
                    setCargandoTrabajos(false);
                }

            }

        };

        obtenerTrabajos();

        return () => {
            activo = false;
        };

    }, [id]);

    // ===== CARGAR SERVICIOS =====
    useEffect(() => {

        const obtenerServicios = async () => {

            try {

                const respuesta = await fetch(
                    `${API_URL}/artistas/${id}/servicios`
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los servicios");
                }

                const datos = await respuesta.json();

                // ===== MOSTRAR SOLO SERVICIOS ACTIVOS =====

                const serviciosActivos = Array.isArray(datos)
                    ? datos.filter((servicio) => servicio.activo === true)
                    : [];

                setServicios(serviciosActivos);

            } catch (error) {

                console.error("Error al cargar servicios:", error);
                setErrorCita("No se han podido cargar los servicios.");

            }

        };

        obtenerServicios();

    }, [id]);

    // ===== CONSULTAR DISPONIBILIDAD =====
    const consultarDisponibilidad = async () => {

        if (!fecha || !artista) {
            return;
        }

        setCargandoHorarios(true);
        setErrorHorarios("");
        setHorarios([]);
        setHoraSeleccionada("");
        setFechaConsultada(false);
        setErrorCita("");
        setMensajeCita("");

        try {

            const respuesta = await fetch(
                `${API_URL}/citas/disponibilidad?id_artista=${artista.id_usuario}&fecha=${fecha}`
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || "Error al consultar disponibilidad"
                );
            }

            setHorarios(
                Array.isArray(datos.horarios_disponibles)
                    ? datos.horarios_disponibles
                    : []
            );

            setFechaConsultada(true);

        } catch (error) {

            console.error(
                "Error al consultar disponibilidad:",
                error
            );

            setErrorHorarios(error.message);

        } finally {

            setCargandoHorarios(false);

        }

    };

    // ===== SOLICITAR CITA =====
    const solicitarCita = async () => {

        setErrorCita("");
        setMensajeCita("");

        if (!token) {

            setErrorCita(
                "Debes iniciar sesión para solicitar una cita."
            );

            return;

        }

        if (usuario?.rol !== "cliente") {

            setErrorCita(
                "Debes iniciar sesión con una cuenta de cliente."
            );

            return;

        }

        if (!fecha || !horaSeleccionada || !idServicio || !artista) {

            setErrorCita(
                "Selecciona un servicio, una fecha y una hora."
            );

            return;

        }

        setEnviandoCita(true);

        try {

            const respuesta = await fetch(`${API_URL}/citas`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({

                    id_artista: artista.id_usuario,
                    id_servicio: Number(idServicio),
                    fecha: fecha,
                    hora: horaSeleccionada

                })

            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                if (respuesta.status === 401) {
                    throw new Error(
                        "Tu sesión ha caducado. Inicia sesión de nuevo."
                    );
                }

                throw new Error(
                    datos.error || "No se pudo solicitar la cita."
                );

            }

            setMensajeCita(
                `Solicitud registrada correctamente. Número de cita: ${datos.id_cita}. Está pendiente de confirmación.`
            );

            // Limpiamos la selección después de guardar
            setHoraSeleccionada("");
            setFechaConsultada(false);
            setHorarios([]);

        } catch (error) {

            console.error("Error al solicitar cita:", error);
            setErrorCita(error.message);

        } finally {

            setEnviandoCita(false);

        }

    };

    // ===== COMPROBAR SI EXISTE EL ARTISTA =====
    if (!artista) {

        return (

            <section id="perfil-artista">

                <h2>Artista no encontrado</h2>

                <Link to="/equipo">
                    Volver a nuestro equipo
                </Link>

            </section>

        );

    }

    return (

        <section id="perfil-artista">

            <h2>Perfil del artista</h2>

            {/* ===== DATOS DEL ARTISTA ===== */}
            <div className="datos-artista">

                {/* ===== FOTOGRAFÍA IZQUIERDA ===== */}
                <div className="contenedor-foto-artista">

                    {artista.imagen && (
                        <img
                            src={artista.imagen}
                            alt={`Fotografía de ${artista.nombre}`}
                            className="foto-perfil-artista"
                        />
                    )}

                </div>

                {/* ===== INFORMACIÓN DERECHA ===== */}
                <div className="informacion-artista">

                    <h3>{artista.nombre}</h3>

                    <p className="especialidad-artista">
                        {artista.especialidad}
                    </p>

                    {/* ===== BIOGRAFÍA ===== */}
                    <div className="biografia-artista">

                        {(artista.descripcion_larga || artista.descripcion)
                            ?.split("\n\n")
                            .map((parrafo, index) => (

                                <p key={index}>
                                    {parrafo}
                                </p>

                            ))}

                    </div>

                </div>

            </div>

            {/* ===== TRABAJOS DEL ARTISTA ===== */}
            <div className="trabajos-artista">

                <h3>Trabajos realizados</h3>

                {cargandoTrabajos ? (

                    <p>Cargando trabajos...</p>

                ) : errorTrabajos ? (

                    <p role="alert">
                        {errorTrabajos}
                    </p>

                ) : trabajos.length > 0 ? (

                    <div className="galeria-trabajos">

                        {trabajos
                            .filter(
                                (trabajo) =>
                                    trabajo.id_artista === Number(id)
                            )
                            .map((trabajo) => (

                                <img
                                    key={trabajo.id_trabajo}
                                    src={trabajo.imagen}
                                    alt={
                                        trabajo.titulo ||
                                        `Trabajo realizado por ${artista.nombre}`
                                    }
                                    className="imagen-trabajo"
                                    loading="lazy"
                                />

                            ))}

                    </div>

                ) : (

                    <p>
                        Este artista todavía no tiene trabajos publicados.
                    </p>

                )}

            </div>

            {/* ===== RESERVAR CITA ===== */}
            <div className="reserva-artista">

                <h3>Solicitar una cita</h3>

                <p>
                    Selecciona un servicio y una fecha para consultar
                    los horarios disponibles.
                </p>

                {/* ===== SELECCIONAR SERVICIO ===== */}
                <label htmlFor="servicio-cita">
                    Servicio:
                </label>

                <select
                    id="servicio-cita"
                    value={idServicio}
                    onChange={(evento) => {

                        setIdServicio(evento.target.value);
                        setErrorCita("");
                        setMensajeCita("");

                    }}
                >

                    <option value="">
                        Selecciona un servicio
                    </option>

                    {servicios.map((servicio) => (

                        <option
                            key={servicio.id_servicio}
                            value={servicio.id_servicio}
                        >
                            {servicio.nombre}
                        </option>

                    ))}

                </select>

                {/* ===== SELECCIONAR FECHA ===== */}
                <label htmlFor="fecha-cita">
                    Fecha de la cita:
                </label>

                <input
                    type="date"
                    id="fecha-cita"
                    value={fecha}
                    min={new Date().toLocaleDateString("sv-SE")}
                    onChange={(evento) => {

                        setFecha(evento.target.value);

                        setHorarios([]);
                        setHoraSeleccionada("");
                        setFechaConsultada(false);
                        setErrorHorarios("");
                        setErrorCita("");
                        setMensajeCita("");

                    }}
                />

                {/* ===== BOTÓN CONSULTAR ===== */}
                <button
                    type="button"
                    onClick={consultarDisponibilidad}
                    disabled={!fecha || cargandoHorarios}
                >

                    {cargandoHorarios
                        ? "Consultando..."
                        : "Consultar disponibilidad"}

                </button>

                {/* ===== ERRORES DE DISPONIBILIDAD ===== */}
                {errorHorarios && (

                    <p role="alert">
                        {errorHorarios}
                    </p>

                )}

                {/* ===== HORARIOS DISPONIBLES ===== */}
                {fechaConsultada && (

                    <div className="horarios-disponibles">

                        <h4>Horarios disponibles</h4>

                        {horarios.length > 0 ? (

                            <div className="lista-horarios">

                                {horarios.map((hora) => (

                                    <button
                                        type="button"
                                        key={hora}
                                        className={
                                            horaSeleccionada === hora
                                                ? "hora-seleccionada"
                                                : ""
                                        }
                                        aria-pressed={horaSeleccionada === hora}
                                        onClick={() => {

                                            setHoraSeleccionada(hora);
                                            setErrorCita("");
                                            setMensajeCita("");

                                        }}
                                    >
                                        {hora}
                                    </button>

                                ))}

                            </div>

                        ) : (

                            <p>
                                No hay horarios disponibles para esta fecha.
                            </p>

                        )}

                        {/* ===== HORA SELECCIONADA ===== */}
                        {horaSeleccionada && (

                            <p className="resumen-hora">
                                Has seleccionado las{" "}
                                <strong>{horaSeleccionada}</strong>.
                            </p>

                        )}

                        {/* ===== INFORMACIÓN DE LA RESERVA ===== */}
                        <p>
                            Los horarios permiten solicitar una cita.
                            La reserva quedará pendiente hasta que
                            el artista confirme su duración y disponibilidad.
                        </p>

                        {/* ===== BOTÓN SOLICITAR CITA ===== */}
                        {horaSeleccionada && (

                            <button
                                type="button"
                                onClick={solicitarCita}
                                disabled={
                                    enviandoCita ||
                                    !idServicio ||
                                    !token ||
                                    usuario?.rol !== "cliente"
                                }
                            >

                                {enviandoCita
                                    ? "Enviando solicitud..."
                                    : "Solicitar cita"}

                            </button>

                        )}

                        {!token && horaSeleccionada && (

                            <p>
                                Inicia sesión para poder solicitar tu cita.
                            </p>

                        )}

                    </div>

                )}

                {/* ===== RESULTADO DE LA SOLICITUD ===== */}
                {errorCita && (

                    <p role="alert">
                        {errorCita}
                    </p>

                )}

                {mensajeCita && (

                    <p role="status">
                        {mensajeCita}
                    </p>

                )}

            </div>

            {/* ===== VOLVER AL EQUIPO ===== */}
            <Link to="/equipo">
                Volver a nuestro equipo
            </Link>

        </section>

    );

}

export default PerfilArtista;