
import { useState, useEffect } from "react";

// ===== COMPONENTE PARA EDITAR CITAS DESDE ADMINISTRACIÓN =====

function AdminEditarCita({
    cita,
    token,
    onCitaActualizada,
    onCancelar
}) {

    // ===== DATOS DEL FORMULARIO =====

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [estado, setEstado] = useState("pendiente");
    const [duracion, setDuracion] = useState("");

    // ===== ESTADOS DE LA PETICIÓN =====

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // ===== CARGAR LOS DATOS DE LA CITA SELECCIONADA =====

    useEffect(() => {

        if (!cita) return;

        setFecha(
            cita.fecha
                ? String(cita.fecha).slice(0, 10)
                : ""
        );

        setHora(
            cita.hora
                ? String(cita.hora).slice(0, 5)
                : ""
        );

        setEstado(cita.estado || "pendiente");

        setDuracion(
            cita.duracion_minutos != null
                ? String(cita.duracion_minutos)
                : ""
        );

        setError("");

    }, [cita]);


    // ===== GUARDAR LOS CAMBIOS =====

    const guardarCambios = async (e) => {

        e.preventDefault();

        if (guardando) return;

        setError("");

        // ===== COMPROBAR AUTENTICACIÓN =====

        if (!token) {

            setError(
                "Debes iniciar sesión como administrador."
            );

            return;

        }

        if (!cita || !cita.id_cita) {

            setError(
                "No se ha seleccionado una cita válida."
            );

            return;

        }

        // ===== VALIDAR FECHA Y HORA =====

        if (!fecha || !hora) {

            setError(
                "Debes indicar la fecha y la hora."
            );

            return;

        }

        const horaValida =
            /^([01]\d|2[0-3]):(00|30)$/.test(hora);

        if (!horaValida || hora < "13:30" || hora > "21:00") {

            setError(
                "La hora debe estar entre las 13:30 y las 21:00, en punto o a y media."
            );

            return;

        }

        // ===== VALIDAR ESTADO =====

        const estadosPermitidos = [
            "pendiente",
            "confirmada",
            "cancelada"
        ];

        if (!estadosPermitidos.includes(estado)) {

            setError(
                "El estado seleccionado no es válido."
            );

            return;

        }

        // ===== VALIDAR DURACIÓN =====

        const duracionNumero =
            duracion === ""
                ? null
                : Number(duracion);

        if (
            duracionNumero !== null &&
            (
                !Number.isInteger(duracionNumero) ||
                duracionNumero <= 0 ||
                duracionNumero % 30 !== 0
            )
        ) {

            setError(
                "La duración debe ser un número positivo y múltiplo de 30 minutos."
            );

            return;

        }

        if (
            estado === "confirmada" &&
            duracionNumero === null
        ) {

            setError(
                "Para confirmar una cita debes indicar su duración."
            );

            return;

        }

        // ===== COMPROBAR HORA DE FINALIZACIÓN =====

        if (
            estado === "confirmada" &&
            duracionNumero !== null
        ) {

            const [horas, minutos] =
                hora.split(":").map(Number);

            const inicioMinutos =
                horas * 60 + minutos;

            const finMinutos =
                inicioMinutos + duracionNumero;

            const cierre = 21 * 60 + 30;

            if (finMinutos > cierre) {

                setError(
                    "La cita no puede terminar después de las 21:30."
                );

                return;

            }

        }

        // ===== PREPARAR LOS DATOS =====

        const datosActualizados = {

            // Conservamos las relaciones originales
            id_cliente: cita.id_cliente,
            id_artista: cita.id_artista,
            id_servicio: cita.id_servicio,

            // Campos que puede modificar el administrador
            fecha,
            hora,
            estado,
            duracion_minutos: duracionNumero

        };

        // ===== ENVIAR CAMBIOS AL BACKEND =====

        setGuardando(true);

        try {

            const respuesta = await fetch(
                `http://localhost:3000/citas/${cita.id_cita}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(datosActualizados)
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo actualizar la cita."
                );

            }

            // Avisamos al componente padre para actualizar el listado
            if (onCitaActualizada) {
                onCitaActualizada(datos);
            }

        } catch (errorPeticion) {

            console.error(
                "Error al actualizar la cita:",
                errorPeticion
            );

            setError(
                errorPeticion.message ||
                "Ha ocurrido un error al guardar los cambios."
            );

        } finally {

            setGuardando(false);

        }

    };


    // ===== FORMULARIO DE EDICIÓN =====

    if (!cita) {
        return null;
    }

    return (

        <section className="admin-editar-cita">

            <h3>
                Editar cita #{cita.id_cita}
            </h3>

            {/* ===== INFORMACIÓN DE LA CITA ===== */}

            <div className="admin-editar-cita-info">

                <p>
                    <strong>Cliente: </strong>
                    {cita.nombre_cliente || `ID ${cita.id_cliente}`}
                </p>

                <p>
                    <strong>Artista: </strong>
                    {cita.nombre_artista || `ID ${cita.id_artista}`}
                </p>

                <p>
                    <strong>Servicio: </strong>
                    {cita.nombre_servicio || `ID ${cita.id_servicio}`}
                </p>

            </div>


            {/* ===== FORMULARIO ===== */}

            <form onSubmit={guardarCambios}>

                {/* ===== FECHA ===== */}

                <div>

                    <label htmlFor="admin-cita-fecha">
                        Fecha de la cita
                    </label>

                    <input
                        id="admin-cita-fecha"
                        type="date"
                        value={fecha}
                        onChange={(e) =>
                            setFecha(e.target.value)
                        }
                        required
                        disabled={guardando}
                    />

                </div>


                {/* ===== HORA ===== */}

                <div>

                    <label htmlFor="admin-cita-hora">
                        Hora de la cita
                    </label>

                    <input
                        id="admin-cita-hora"
                        type="time"
                        min="13:30"
                        max="21:00"
                        step="1800"
                        value={hora}
                        onChange={(e) =>
                            setHora(e.target.value)
                        }
                        required
                        disabled={guardando}
                    />

                </div>


                {/* ===== ESTADO ===== */}

                <div>

                    <label htmlFor="admin-cita-estado">
                        Estado de la cita
                    </label>

                    <select
                        id="admin-cita-estado"
                        value={estado}
                        onChange={(e) =>
                            setEstado(e.target.value)
                        }
                        disabled={guardando}
                    >

                        <option value="pendiente">
                            Pendiente
                        </option>

                        <option value="confirmada">
                            Confirmada
                        </option>

                        <option value="cancelada">
                            Cancelada
                        </option>

                    </select>

                </div>


                {/* ===== DURACIÓN ===== */}

                <div>

                    <label htmlFor="admin-cita-duracion">
                        Duración en minutos
                    </label>

                    <input
                        id="admin-cita-duracion"
                        type="number"
                        min="30"
                        step="30"
                        value={duracion}
                        onChange={(e) =>
                            setDuracion(e.target.value)
                        }
                        required={estado === "confirmada"}
                        disabled={guardando}
                        placeholder="Ejemplo: 60"
                    />

                    <small>
                        La duración debe ser múltiplo de
                        30 minutos. Es obligatoria para
                        las citas confirmadas.
                    </small>

                </div>


                {/* ===== MENSAJES DE ERROR ===== */}

                {error && (

                    <p role="alert">
                        {error}
                    </p>

                )}


                {/* ===== BOTONES ===== */}

                <div className="admin-editar-cita-acciones">

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

                </div>

            </form>

        </section>

    );

}

export default AdminEditarCita;
