/*----Importamos los hooks de React----*/
import { useState, useEffect } from "react";


/*----Componente para registrar nuevos trabajos----*/
function AdminCrearTrabajo({ token, onTrabajoCreado, onCancelar }) {

    // ===== ESTADOS =====

    const [artistas, setArtistas] = useState([]);
    const [idArtista, setIdArtista] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("");
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


    // ===== REGISTRAR TRABAJO =====

    const crearTrabajo = async (evento) => {

        evento.preventDefault();

        setError("");

        /*----Validamos los campos obligatorios----*/

        if (!idArtista || !titulo.trim() || !descripcion.trim()) {

            setError(
                "Selecciona un artista e introduce el título y la descripción."
            );

            return;

        }

        if (titulo.trim().length > 150) {

            setError(
                "El título no puede superar los 150 caracteres."
            );

            return;

        }

        if (imagen.trim().length > 255) {

            setError(
                "La ruta de la imagen no puede superar los 255 caracteres."
            );

            return;

        }

        setGuardando(true);

        try {

            /*----Enviamos los datos al backend----*/

            const respuesta = await fetch(
                "http://localhost:3000/trabajos",
                {
                    method: "POST",

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

            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo registrar el trabajo."
                );

            }

            /*----Actualizamos el listado de trabajos----*/

            onTrabajoCreado(datos);

        } catch (error) {

            console.error(
                "Error al registrar el trabajo:",
                error
            );

            setError(error.message);

        } finally {

            setGuardando(false);

        }

    };


    // ===== FORMULARIO DE REGISTRO =====

    return (

        <section className="admin-crear-trabajo">

            <h3>Registrar nuevo trabajo</h3>

            <form onSubmit={crearTrabajo}>

                <label htmlFor="trabajo-artista">
                    Artista
                </label>

                <select
                    id="trabajo-artista"
                    value={idArtista}
                    onChange={(evento) =>
                        setIdArtista(evento.target.value)
                    }
                    required
                    disabled={cargandoArtistas || !!errorArtistas}
                >

                    <option value="">
                        Selecciona un artista
                    </option>

                    {artistas.map((artista) => (

                        <option
                            key={artista.id_usuario}
                            value={artista.id_usuario}
                        >
                            {artista.nombre}
                        </option>

                    ))}

                </select>


                <label htmlFor="trabajo-titulo">
                    Título
                </label>

                <input
                    id="trabajo-titulo"
                    type="text"
                    value={titulo}
                    onChange={(evento) =>
                        setTitulo(evento.target.value)
                    }
                    maxLength={150}
                    required
                />


                <label htmlFor="trabajo-descripcion">
                    Descripción
                </label>

                <textarea
                    id="trabajo-descripcion"
                    value={descripcion}
                    onChange={(evento) =>
                        setDescripcion(evento.target.value)
                    }
                    required
                />


                <label htmlFor="trabajo-imagen">
                    Ruta de la imagen
                </label>

                <input
                    id="trabajo-imagen"
                    type="text"
                    value={imagen}
                    onChange={(evento) =>
                        setImagen(evento.target.value)
                    }
                    placeholder="/Trabajos/David/D_1.jpg"
                    maxLength={255}
                />


                {cargandoArtistas && (
                    <p>Cargando artistas...</p>
                )}

                {errorArtistas && (
                    <p role="alert">{errorArtistas}</p>
                )}

                {error && (
                    <p role="alert">{error}</p>
                )}


                <button
                    type="submit"
                    disabled={
                        guardando ||
                        cargandoArtistas ||
                        !!errorArtistas ||
                        artistas.length === 0
                    }
                >
                    {guardando
                        ? "Guardando..."
                        : "Registrar trabajo"}
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

export default AdminCrearTrabajo;