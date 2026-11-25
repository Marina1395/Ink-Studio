/*----Importamos el hook de React----*/
import { useState } from "react";


/*----Componente para eliminar trabajos----*/
function AdminEliminarTrabajo({
    token,
    trabajo,
    onTrabajoEliminado
}) {

    // ===== ESTADOS =====

    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState("");


    // ===== ELIMINAR TRABAJO =====

    const eliminarTrabajo = async () => {

        setError("");

        /*----Solicitamos confirmación antes de eliminar----*/
        const confirmar = window.confirm(
            `¿Seguro que quieres eliminar el trabajo "${trabajo.titulo || "Sin título"}"? Esta acción no se puede deshacer.`
        );

        if (!confirmar) {

            return;

        }

        setEliminando(true);

        try {

            /*----Comprobamos que exista un token----*/
            if (!token) {

                throw new Error(
                    "Debes iniciar sesión como administrador."
                );

            }

            /*----Enviamos la petición DELETE al backend----*/
            const respuesta = await fetch(
                `http://localhost:3000/trabajos/${trabajo.id_trabajo}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            /*----Comprobamos la respuesta del servidor----*/
            if (!respuesta.ok) {

                const datos = await respuesta.json();

                throw new Error(
                    datos.error ||
                    "No se pudo eliminar el trabajo."
                );

            }


            /*----Actualizamos el listado de trabajos----*/
            onTrabajoEliminado(trabajo.id_trabajo);

        } catch (error) {

            console.error(
                "Error al eliminar el trabajo:",
                error
            );

            setError(error.message);

        } finally {

            setEliminando(false);

        }

    };


    // ===== BOTÓN PARA ELIMINAR TRABAJO =====

    return (

        <>

            <button
                type="button"
                onClick={eliminarTrabajo}
                disabled={eliminando}
            >
                {eliminando
                    ? "Eliminando..."
                    : "Eliminar"}
            </button>


            {/* ===== MENSAJE DE ERROR ===== */}

            {error && (
                <p role="alert">{error}</p>
            )}

        </>

    );

}


// ===== EXPORTAR COMPONENTE =====

export default AdminEliminarTrabajo;