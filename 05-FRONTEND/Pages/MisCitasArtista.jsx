
/*----Importamos los hooks para gestionar las citas del artista----*/
import { useState, useEffect } from "react";


/*----Panel de gestión de citas para artistas----*/
function MisCitasArtista({ token }) {

    /*----Guardamos las citas asignadas al artista----*/
    const [citas, setCitas] = useState([]);

    /*----Controlamos la carga de las citas----*/
    const [cargandoCitas, setCargandoCitas] = useState(false);

    /*----Guardamos los posibles errores----*/
    const [errorCitas, setErrorCitas] = useState("");

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


    /*----Consultamos las citas asignadas al artista autenticado----*/
    useEffect(() => {

        /*----Si no hay token, limpiamos las citas----*/
        if (!token) {
            setCitas([]);
            setErrorCitas("");
            setCargandoCitas(false);
            return;
        }

        /*----Preparamos la consulta al backend----*/
        const obtenerCitas = async () => {

            setCargandoCitas(true);
            setErrorCitas("");

            try {

                const respuesta = await fetch(
                    "http://localhost:3000/citas",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron obtener las citas del artista."
                    );
                }

                const datos = await respuesta.json();

                /*----Guardamos las citas recibidas----*/
                setCitas(datos);

            } catch (error) {

                setErrorCitas(error.message);

            } finally {

                setCargandoCitas(false);

            }

        };

        obtenerCitas();

    }, [token]);


    /*----Confirmamos una solicitud de cita----*/
    const aceptarCita = async (cita) => {

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
            setErrorCitas("");

        } catch (error) {

            setErrorCitas(error.message);

        }

    };


    /*----Rechazamos una solicitud de cita----*/
    const rechazarCita = async (cita) => {

        /*----Pedimos confirmación antes de rechazar----*/
        const confirmar = window.confirm(
            `¿Seguro que quieres rechazar la solicitud #${cita.id_cita}?`
        );

        if (!confirmar) {
            return;
        }

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
                    datos.error || "No se pudo rechazar la cita."
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

            setErrorCitas("");

        } catch (error) {

            setErrorCitas(error.message);

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

            {/*----Mostramos los errores----*/}
            {errorCitas && (
                <p role="alert">{errorCitas}</p>
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

                            </div>

                        ))}

                    </div>

                )}

        </section>

    );

}

export default MisCitasArtista;
