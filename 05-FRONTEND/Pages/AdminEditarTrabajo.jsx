/*----Importamos los hooks de React----*/
import { useState, useEffect } from "react";


/*----Componente para editar trabajos----*/
function AdminEditarTrabajo({
    token,
    trabajo,
    onTrabajoActualizado,
    onCancelar
}) {

    // ===== ESTADOS =====

    const [artistas, setArtistas] = useState([]);
    const [idArtista, setIdArtista] = useState(
        trabajo.id_artista ?? ""
    );
    const [titulo, setTitulo] = useState(trabajo.titulo ?? "");
    const [descripcion, setDescripcion] = useState(
        trabajo.descripcion ?? ""
    );
    const [imagen, setImagen] = useState(trabajo.imagen ?? "");

    const [guardando, setGuardando] = useState(false);
    const [cargandoArtistas, setCargandoArtistas] = useState(true);
    const [errorArtistas, setErrorArtistas] = useState("");
    const [error, setError] = useState("");


    // ===== OBTENER ARTISTAS ACTIVOS =====

    useEffect(() => {

        const obtenerArtistas = async () => {

            try {

                const respuesta = await fetch(
                    "http://localhost:3000/artistas"
                );

                const datos = await respuesta.json();

                if (!respuesta.ok || !Array.isArray(datos)) {

                    throw new Error(
                        "No se pudieron cargar los artistas."
                    );

                }

                setArtistas(datos);

            } catch (error) {

                setErrorArtistas(error.message);

            } finally {

                setCargandoArtistas(false);

            }

        };

        obtenerArtistas();

    }, []);


    // ===== ACTUALIZAR TRABAJO =====

    const actualizarTrabajo = async (evento) => {

        evento.preventDefault();

        setError("");


        /*----Validamos los campos obligatorios----*/

        if (!idArtista || !titulo.trim() || !descripcion.trim()) {

            setError(
                "Selecciona un artista e introduce el título y la descripción."
            );

            return;

        }


        /*----Validamos la longitud del título----*/

        if (titulo.trim().length > 150) {

            setError(
                "El título no puede superar los 150 caracteres."
            );

            return;

        }


        /*----Validamos la longitud de la ruta----*/

        if (imagen.trim().length > 255) {

            setError(
                "La ruta de la imagen no puede superar los 255 caracteres."
            );

            return;

        }


        /*----Evitamos guardar rutas absolutas de Windows----*/

        if (
            imagen.trim() &&
            !imagen.trim().startsWith("/Trabajos/") &&
            !imagen.trim().startsWith("/NuestrosTrabajos/")
        ) {

            setError(
                "Introduce una ruta válida, por ejemplo: /Trabajos/David/D_1.jpg"
            );

            return;

        }


        setGuardando(true);

        try {

            /*----Enviamos los datos actualizados al backend----*/

            const respuesta = await fetch(
                `http://localhost:3000/trabajos/${trabajo.id_trabajo}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        id_artista: Number(idArtista),
                        titulo: titulo.trim(),
                        descripcion: descripcion.trim(),
                        imagen: imagen.trim() || null
                    })
                }
            );

            const datos = await respuesta.json();


            /*----Comprobamos la respuesta del servidor----*/

            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo actualizar el trabajo."
                );

            }


            /*----Actualizamos el listado de trabajos----*/

            onTrabajoActualizado(datos);

        } catch (error) {

            console.error(
                "Error al actualizar el trabajo:",
                error
            );

            setError(error.message);

        } finally {

            setGuardando(false);

        }

    };


    // ===== FORMULARIO DE EDICIÓN =====

    return (

        <section className="admin-editar-trabajo">

            <h3>Editar trabajo</h3>

            <form onSubmit={actualizarTrabajo}>


                {/* ===== SELECCIONAR ARTISTA ===== */}

                <label htmlFor="editar-trabajo-artista">
                    Artista
                </label>

                <select
                    id="editar-trabajo-artista"
                    value={idArtista}
                    onChange={(evento) =>
                        setIdArtista(evento.target.value)
                    }
                    required
                    disabled={
                        guardando ||
                        cargandoArtistas ||
                        !!errorArtistas
                    }
                >

                    <option value="">
                        Selecciona un artista
                    </option>


                    {/*----Conservamos el artista original si está inactivo----*/}

                    {!cargandoArtistas &&
                        !errorArtistas &&
                        trabajo.id_artista &&
                        !artistas.some(
                            (artista) =>
                                Number(artista.id_usuario) ===
                                Number(trabajo.id_artista)
                        ) && (

                            <option value={trabajo.id_artista}>
                                Artista original (ID {trabajo.id_artista})
                            </option>

                        )}


                    {artistas.map((artista) => (

                        <option
                            key={artista.id_usuario}
                            value={artista.id_usuario}
                        >
                            {artista.nombre}
                        </option>

                    ))}

                </select>


                {/* ===== TÍTULO ===== */}

                <label htmlFor="editar-trabajo-titulo">
                    Título
                </label>

                <input
                    id="editar-trabajo-titulo"
                    type="text"
                    value={titulo}
                    onChange={(evento) =>
                        setTitulo(evento.target.value)
                    }
                    maxLength={150}
                    required
                    disabled={guardando}
                />


                {/* ===== DESCRIPCIÓN ===== */}

                <label htmlFor="editar-trabajo-descripcion">
                    Descripción
                </label>

                <textarea
                    id="editar-trabajo-descripcion"
                    value={descripcion}
                    onChange={(evento) =>
                        setDescripcion(evento.target.value)
                    }
                    required
                    disabled={guardando}
                />


                {/* ===== RUTA DE LA IMAGEN ===== */}

                <label htmlFor="editar-trabajo-imagen">
                    Ruta de la imagen
                </label>

                <input
                    id="editar-trabajo-imagen"
                    type="text"
                    value={imagen}
                    onChange={(evento) =>
                        setImagen(evento.target.value)
                    }
                    placeholder="/Trabajos/David/D_1.jpg"
                    maxLength={255}
                    disabled={guardando}
                />


                {/* ===== MENSAJES ===== */}

                {cargandoArtistas && (
                    <p>Cargando artistas...</p>
                )}

                {errorArtistas && (
                    <p role="alert">{errorArtistas}</p>
                )}

                {error && (
                    <p role="alert">{error}</p>
                )}


                {/* ===== BOTONES ===== */}

                <button
                    type="submit"
                    disabled={
                        guardando ||
                        cargandoArtistas ||
                        !!errorArtistas
                    }
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

            </form>

        </section>

    );

}


// ===== EXPORTAR COMPONENTE =====

export default AdminEditarTrabajo;