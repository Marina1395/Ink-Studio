
/*----Importamos el hook de React----*/
import { useState } from "react";


//=======COMPONENTE CONTACTO=======//

function Contacto() {

    // ===== ESTADOS =====

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [confirmacion, setConfirmacion] = useState("");


    // ===== ENVIAR MENSAJE =====

    const enviarMensaje = async (evento) => {

        evento.preventDefault();

        setError("");
        setConfirmacion("");

        /*----Validamos los campos obligatorios----*/

        if (
            !nombre.trim() ||
            !email.trim() ||
            !asunto.trim() ||
            !mensaje.trim()
        ) {

            setError("Todos los campos son obligatorios.");

            return;

        }

        /*----Validamos el formato del correo electrónico----*/

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email.trim())) {

            setError("Introduce un correo electrónico válido.");

            return;

        }

        /*----Validamos la longitud de los campos----*/

        if (
            nombre.trim().length > 100 ||
            email.trim().length > 150 ||
            asunto.trim().length > 150 ||
            mensaje.trim().length > 5000
        ) {

            setError("Uno o varios campos superan la longitud permitida.");

            return;

        }

        setEnviando(true);

        try {

            /*----Enviamos los datos al backend----*/

            const respuesta = await fetch(
                "http://localhost:3000/mensajes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        email: email.trim().toLowerCase(),
                        asunto: asunto.trim(),
                        mensaje: mensaje.trim()
                    })
                }
            );

            /*----Convertimos la respuesta a JSON----*/

            const datos = await respuesta.json();

            /*----Comprobamos que el envío sea correcto----*/

            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo enviar el mensaje."
                );

            }

            /*----Mostramos el mensaje de confirmación----*/

            setConfirmacion(
                "Tu mensaje se ha enviado correctamente. Gracias por contactar con Hache Studio."
            );

            /*----Limpiamos los campos del formulario----*/

            setNombre("");
            setEmail("");
            setAsunto("");
            setMensaje("");

        } catch (error) {

            console.error(
                "Error al enviar el mensaje:",
                error
            );

            setError(error.message);

        } finally {

            setEnviando(false);

        }

    };


    // ===== INTERFAZ DE CONTACTO =====

    return (

        <main className="pagina-contacto">

            <section className="contacto-introduccion">

                <h1>Contacto</h1>

                <p>
                    ¿Tienes alguna duda o quieres más información
                    sobre nuestros servicios? Ponte en contacto
                    con nosotros.
                </p>

            </section>


            {/* ===== FORMULARIO DE CONTACTO ===== */}

            <section className="contacto-formulario">

                <h2>Envíanos un mensaje</h2>

                <form onSubmit={enviarMensaje}>

                    <label htmlFor="contacto-nombre">
                        Nombre
                    </label>

                    <input
                        id="contacto-nombre"
                        type="text"
                        value={nombre}
                        onChange={(evento) =>
                            setNombre(evento.target.value)
                        }
                        placeholder="Tu nombre"
                        maxLength={100}
                        autoComplete="name"
                        required
                        disabled={enviando}
                    />


                    <label htmlFor="contacto-email">
                        Correo electrónico
                    </label>

                    <input
                        id="contacto-email"
                        type="email"
                        value={email}
                        onChange={(evento) =>
                            setEmail(evento.target.value)
                        }
                        placeholder="Tu correo electrónico"
                        maxLength={150}
                        autoComplete="email"
                        required
                        disabled={enviando}
                    />


                    <label htmlFor="contacto-asunto">
                        Asunto
                    </label>

                    <input
                        id="contacto-asunto"
                        type="text"
                        value={asunto}
                        onChange={(evento) =>
                            setAsunto(evento.target.value)
                        }
                        placeholder="Motivo de tu consulta"
                        maxLength={150}
                        required
                        disabled={enviando}
                    />


                    <label htmlFor="contacto-mensaje">
                        Mensaje
                    </label>

                    <textarea
                        id="contacto-mensaje"
                        value={mensaje}
                        onChange={(evento) =>
                            setMensaje(evento.target.value)
                        }
                        placeholder="Escribe aquí tu mensaje"
                        maxLength={5000}
                        rows={6}
                        required
                        disabled={enviando}
                    />


                    {/* ===== MENSAJES DE ERROR Y CONFIRMACIÓN ===== */}

                    {error && (

                        <p
                            className="contacto-error"
                            role="alert"
                        >
                            {error}
                        </p>

                    )}

                    {confirmacion && (

                        <p
                            className="contacto-confirmacion"
                            role="status"
                        >
                            {confirmacion}
                        </p>

                    )}


                    {/* ===== BOTÓN DE ENVÍO ===== */}

                    <button
                        type="submit"
                        disabled={enviando}
                    >
                        {enviando
                            ? "Enviando mensaje..."
                            : "Enviar mensaje"}
                    </button>

                </form>

            </section>

        </main>

    );

}


//=======EXPORTAR COMPONENTE=======//

export default Contacto;
