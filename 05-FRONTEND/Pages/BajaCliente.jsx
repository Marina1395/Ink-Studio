/*----Importamos los hooks necesarios----*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";


/*----Recibimos los datos del cliente autenticado----*/
function BajaCliente({ token, usuario, cerrarSesion }) {

    /*----Controlamos el estado de la operación----*/
    const [procesandoBaja, setProcesandoBaja] = useState(false);

    /*----Guardamos posibles errores----*/
    const [errorBaja, setErrorBaja] = useState("");

    /*----Preparamos la navegación entre páginas----*/
    const navigate = useNavigate();


    //=======SOLICITAR LA BAJA VOLUNTARIA=======//

    const solicitarBaja = async () => {

        setErrorBaja("");


        /*----Solicitamos confirmación antes de desactivar la cuenta----*/
        const confirmarBaja = window.confirm(

            "Si das de baja tu cuenta, todas tus citas futuras pendientes y confirmadas serán canceladas. No podrás volver a acceder a tu cuenta. ¿Deseas continuar?"

        );


        /*----Detenemos la operación si el cliente no confirma----*/
        if (!confirmarBaja) {

            return;

        }


        setProcesandoBaja(true);


        try {

            /*----Enviamos la solicitud de baja al backend----*/
            const respuesta = await fetch(

                `http://localhost:3000/usuarios/${usuario.id_usuario}`,

                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            const datos = await respuesta.json();


            /*----Comprobamos si la operación se ha realizado correctamente----*/
            if (!respuesta.ok) {

                throw new Error(
                    datos.error || "No se pudo dar de baja la cuenta."
                );

            }


            /*----Informamos al cliente de que su cuenta ha sido desactivada----*/
            window.alert(
                "Tu cuenta se ha dado de baja correctamente."
            );


            /*----Cerramos la sesión del cliente----*/
            cerrarSesion();


            /*----Redirigimos al cliente a la página principal----*/
            navigate("/", { replace: true });


        } catch (error) {

            /*----Mostramos los errores de la operación----*/
            setErrorBaja(error.message);

        } finally {

            setProcesandoBaja(false);

        }

    };


    //=======MOSTRAMOS EL APARTADO DE BAJA=======//

    return (

        <section className="baja-cliente">

            <h2>Gestionar mi cuenta</h2>

            <p>
                Puedes solicitar la baja de tu cuenta.
                Tus citas futuras pendientes y confirmadas
                serán canceladas automáticamente.
            </p>


            {/*----Mostramos posibles errores----*/}
            {errorBaja && (

                <p role="alert">{errorBaja}</p>

            )}


            {/*----Botón para solicitar la baja voluntaria----*/}
            <button
                type="button"
                className="boton-baja-cliente"
                onClick={solicitarBaja}
                disabled={procesandoBaja}
            >

                {procesandoBaja
                    ? "Procesando baja..."
                    : "Darme de baja"}

            </button>

        </section>

    );

}

export default BajaCliente;