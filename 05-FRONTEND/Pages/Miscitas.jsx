/*----Importamos los hooks para guardar y consultar las citas----*/
import { useState, useEffect } from "react";

/*----Recibimos el token del usuario autenticado----*/
function MisCitas({ token }) {

    /*----Guardamos las citas del cliente----*/
    const [citas, setCitas] = useState([]);

    /*----Controlamos si las citas se están cargando----*/
    const [cargandoCitas, setCargandoCitas] = useState(false);

    /*----Guardamos posibles errores de la consulta----*/
    const [errorCitas, setErrorCitas] = useState("");


    /*----Consultamos las citas cuando el cliente inicia sesión----*/
    useEffect(() => {

        /*----Si no hay token, limpiamos las citas----*/
        if (!token) {
            setCitas([]);
            setErrorCitas("");
            setCargandoCitas(false);
            return;
        }

        /*----Preparamos la petición al backend----*/
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
                    throw new Error("No se pudieron obtener las citas.");
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

    return (

        <section id="mis-citas">


            {/*----Apartado de reservas del cliente----*/}
            <h2>Mis citas</h2>


            {/*----Mostramos el estado de carga----*/}
            {cargandoCitas && (
                <p>Cargando tus citas...</p>
            )}

            {/*----Mostramos los errores de la consulta----*/}
            {errorCitas && (
                <p role="alert">{errorCitas}</p>
            )}

            {/*----Informamos si el cliente no tiene citas----*/}
            {!cargandoCitas && !errorCitas && citas.length === 0 && (
                <p>Todavía no tienes ninguna cita registrada.</p>
            )}

            {/*----Mostramos las citas del cliente----*/}
            {!cargandoCitas && !errorCitas && citas.length > 0 && (

                <div className="lista-citas">

                    {citas.map((cita) => (

                        <div
                            className="tarjeta-cita"
                            key={cita.id_cita}
                        >

                            <h3>Cita #{cita.id_cita}</h3>

                            <p>
                                <strong>Fecha:</strong>{" "}
                                {cita.fecha?.slice(0, 10).split("-").reverse().join("/")}
                            </p>

                            <p>
                                <strong>Hora:</strong>{" "}
                                {cita.hora?.slice(0, 5)}
                            </p>

                            <p>
                                <strong>Estado:</strong>{" "}
                                {cita.estado}
                            </p>

                        </div>

                    ))}

                </div>

            )}


        </section>

    );

}

export default MisCitas;
