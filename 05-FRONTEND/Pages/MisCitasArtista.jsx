/*----Importamos los hooks para gestionar las citas del artista----*/
import { useState, useEffect } from "react";


/*----Panel de gestión de citas para artistas----*/
function MisCitasArtista({ token }) {

    /*----Comprobamos que existe una sesión activa----*/
    if (!token) {
        return null;
    }

    /*----Reiniciamos el panel cuando cambia la sesión----*/
    return (

        <PanelCitasArtista
            key={token}
            token={token}
        />

    );

}


/*----Componente interno de gestión de citas----*/
function PanelCitasArtista({ token }) {

    /*----Guardamos las citas asignadas al artista----*/
    const [citas, setCitas] = useState([]);

    /*----Controlamos la carga de las citas----*/
    const [cargandoCitas, setCargandoCitas] = useState(true);

    /*----Guardamos los errores de carga del listado----*/
    const [errorCitas, setErrorCitas] = useState("");

    /*----Guardamos los errores al realizar operaciones----*/
    const [errorOperacion, setErrorOperacion] = useState("");

    /*----Guardamos la duración elegida para cada cita----*/
    const [duraciones, setDuraciones] = useState({});


    /*----Convertimos las fechas al calendario de Madrid----*/
    const obtenerFechaMadrid = (fecha) => {

        return new Intl.DateTimeFormat("sv-SE", {
            timeZone: "Europe/Madrid",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date(fecha));

    };


    /*----Comprobamos si la cita todavía no ha comenzado----*/
    const esCitaFutura = (cita) => {

        const ahora = new Date();

        const fechaActual = obtenerFechaMadrid(ahora);

        const horaActual = new Intl.DateTimeFormat("es-ES", {
            timeZone: "Europe/Madrid",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).format(ahora);

        const fechaCita = obtenerFechaMadrid(cita.fecha);
        const horaCita = cita.hora.slice(0, 5);

        return fechaCita > fechaActual ||
            (fechaCita === fechaActual && horaCita > horaActual);

    };


    /*----Consultamos las citas asignadas al artista autenticado----*/
    useEffect(() => {

        /*----Creamos un controlador para cancelar la petición----*/
        const controlador = new AbortController();

        /*----Preparamos la consulta al backend----*/
        const obtenerCitas = async () => {

            try {

                const respuesta = await fetch(
                    "http://localhost:3000/citas",
                    {
                        method: "GET",

                        headers: {
                            Authorization: `Bearer ${token}`
                        },

                        signal: controlador.signal
                    }
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron obtener las citas del artista."
                    );
                }

                const datos = await respuesta.json();

                /*----Guardamos las citas recibidas----*/
                if (!controlador.signal.aborted) {

                    setCitas(datos);

                }

            } catch (error) {

                /*----Mostramos errores de carga reales----*/
                if (!controlador.signal.aborted) {

                    setErrorCitas(error.message);

                }

            } finally {

                if (!controlador.signal.aborted) {

                    setCargandoCitas(false);

                }

            }

        };

        obtenerCitas();

        /*----Cancelamos la consulta al abandonar el componente----*/
        return () => {

            controlador.abort();

        };

    }, [token]);


    /*----Confirmamos una solicitud de cita----*/
    const aceptarCita = async (cita) => {

        /*----Limpiamos los errores de operaciones anteriores----*/
        setErrorOperacion("");

        /*----Obtenemos la duración seleccionada----*/
        const duracion = Number(
            duraciones[cita.id_cita] ?? "60"
        );

        try {

            /*----Enviamos la confirmación al backend----*/
            const respuesta = await fetch(
                `http://localhost:3000/citas/${cita.id_cita}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        id_cliente: cita.id_cliente,
                        id_artista: cita.id_artista,
                        id_servicio: cita.id_servicio,

                        /*----Enviamos la fecha correcta de Madrid----*/
                        fecha: obtenerFechaMadrid(cita.fecha),

                        hora: cita.hora.slice(0, 5),
                        estado: "confirmada",
                        duracion_minutos: duracion

                    })
                }
            );

            const datos = await respuesta.json();

            /*----Comprobamos si el backend devuelve un error----*/
            if (!respuesta.ok) {
                throw new Error(
                    datos.error || "No se pudo confirmar la cita."
                );
            }

            /*----Actualizamos la cita en pantalla----*/
            setCitas((anteriores) =>
                anteriores.map((actual) =>
                    actual.id_cita === cita.id_cita
                        ? datos
                        : actual
                )
            );

            /*----Limpiamos los errores anteriores----*/
            setErrorOperacion("");

        } catch (error) {

            /*----Mostramos el error sin ocultar el listado----*/
            setErrorOperacion(error.message);

        }

    };


    /*----Rechazamos solicitudes pendientes o cancelamos citas confirmadas----*/
    const rechazarCita = async (cita) => {

        /*----Identificamos la acción según el estado de la cita----*/
        const accion = cita.estado === "confirmada"
            ? "cancelar"
            : "rechazar";

        /*----Comprobamos que la cita confirmada sigue siendo futura----*/
        if (cita.estado === "confirmada" && !esCitaFutura(cita)) {

            window.alert(
                "No puedes cancelar una cita que ya ha comenzado."
            );

            return;

        }

        /*----Pedimos confirmación antes de cambiar el estado----*/
        const confirmar = window.confirm(
            `¿Seguro que quieres ${accion} la cita #${cita.id_cita}?`
        );

        if (!confirmar) {
            return;
        }

        /*----Limpiamos los errores de operaciones anteriores----*/
        setErrorOperacion("");

        try {

            /*----Enviamos el cambio de estado al backend----*/
            const respuesta = await fetch(
                `http://localhost:3000/citas/${cita.id_cita}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        id_cliente: cita.id_cliente,
                        id_artista: cita.id_artista,
                        id_servicio: cita.id_servicio,

                        /*----Conservamos la fecha correcta----*/
                        fecha: obtenerFechaMadrid(cita.fecha),

                        hora: cita.hora.slice(0, 5),

                        /*----Cambiamos el estado a cancelada----*/
                        estado: "cancelada",

                        duracion_minutos: cita.duracion_minutos ?? null

                    })
                }
            );

            const datos = await respuesta.json();

            /*----Comprobamos si el backend devuelve un error----*/
            if (!respuesta.ok) {
                throw new Error(
                    datos.error || `No se pudo ${accion} la cita.`
                );
            }

            /*----Actualizamos la cita en pantalla----*/
            setCitas((anteriores) =>
                anteriores.map((actual) =>
                    actual.id_cita === cita.id_cita
                        ? datos
                        : actual
                )
            );

            setErrorOperacion("");

        } catch (error) {

            /*----Mostramos el error sin ocultar el listado----*/
            setErrorOperacion(error.message);

        }

    };


    return (

        <section id="mis-citas-artista">

            {/*----Título del panel----*/}
            <h2>Gestión de citas</h2>

            <p>
                Consulta las solicitudes de tus clientes.
            </p>

            {/*----Mensaje mientras se cargan las citas----*/}
            {cargandoCitas && (
                <p>Cargando solicitudes...</p>
            )}

            {/*----Mostramos los errores de carga----*/}
            {errorCitas && (
                <p role="alert">{errorCitas}</p>
            )}

            {/*----Mostramos los errores de operaciones----*/}
            {errorOperacion && (
                <p role="alert">{errorOperacion}</p>
            )}

            {/*----Si el artista no tiene citas----*/}
            {!cargandoCitas &&
                !errorCitas &&
                citas.length === 0 && (
                    <p>
                        No tienes solicitudes de citas registradas.
                    </p>
                )}

            {/*----Listado de citas del artista----*/}
            {!cargandoCitas &&
                !errorCitas &&
                citas.length > 0 && (

                    <div className="lista-citas-artista">

                        {citas.map((cita) => (

                            <div
                                className="tarjeta-cita-artista"
                                key={cita.id_cita}
                            >

                                {/*----Identificador de la solicitud----*/}
                                <h3>
                                    Solicitud #{cita.id_cita}
                                </h3>

                                {/*----Fecha de la cita----*/}
                                <p>
                                    <strong>Fecha:</strong>{" "}

                                    {new Date(cita.fecha).toLocaleDateString(
                                        "es-ES",
                                        {
                                            timeZone: "Europe/Madrid"
                                        }
                                    )}
                                </p>

                                {/*----Hora de la cita----*/}
                                <p>
                                    <strong>Hora:</strong>{" "}
                                    {cita.hora?.slice(0, 5)}
                                </p>

                                {/*----Estado de la cita----*/}
                                <p>
                                    <strong>Estado:</strong>{" "}
                                    {cita.estado}
                                </p>

                                {/*----Opciones para citas pendientes----*/}
                                {cita.estado === "pendiente" && (

                                    <div className="duracion-cita-artista">

                                        {/*----Seleccionamos la duración----*/}
                                        <label
                                            htmlFor={`duracion-${cita.id_cita}`}
                                        >
                                            Duración estimada:
                                        </label>

                                        <select
                                            id={`duracion-${cita.id_cita}`}
                                            value={
                                                duraciones[cita.id_cita] ?? "60"
                                            }
                                            onChange={(e) => {

                                                /*----Guardamos la duración seleccionada----*/
                                                setDuraciones((anteriores) => ({
                                                    ...anteriores,
                                                    [cita.id_cita]:
                                                        e.target.value
                                                }));

                                            }}
                                        >

                                            <option value="30">
                                                30 minutos
                                            </option>

                                            <option value="60">
                                                1 hora
                                            </option>

                                            <option value="90">
                                                1 hora y 30 minutos
                                            </option>

                                            <option value="120">
                                                2 horas
                                            </option>

                                            <option value="180">
                                                3 horas
                                            </option>

                                            <option value="240">
                                                4 horas
                                            </option>

                                        </select>


                                        {/*----Botón para confirmar la cita----*/}
                                        <button
                                            type="button"
                                            onClick={() => aceptarCita(cita)}
                                        >
                                            Aceptar cita
                                        </button>


                                        {/*----Botón para rechazar la solicitud----*/}
                                        <button
                                            type="button"
                                            onClick={() => rechazarCita(cita)}
                                        >
                                            Rechazar cita
                                        </button>

                                    </div>

                                )}


                                {/*----Opciones para citas confirmadas y futuras----*/}
                                {cita.estado === "confirmada" &&
                                    esCitaFutura(cita) && (

                                        <button
                                            type="button"
                                            onClick={() => rechazarCita(cita)}
                                        >
                                            Cancelar cita
                                        </button>

                                    )}

                            </div>

                        ))}

                    </div>

                )}

        </section>

    );

}

export default MisCitasArtista;