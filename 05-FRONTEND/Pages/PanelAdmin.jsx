
import { useState, useEffect } from "react";

/*----Formulario para registrar artistas desde administración----*/
import AdminCrearArtista from "./AdminCrearArtista";

function PanelAdmin({ token }) {

    // ===== SECCIÓN SELECCIONADA =====
    const [seccion, setSeccion] = useState("inicio");


    // ===== LISTADO DE ARTISTAS =====
    const [artistas, setArtistas] = useState([]);
    const [cargandoArtistas, setCargandoArtistas] = useState(false);
    const [errorArtistas, setErrorArtistas] = useState("");


    // ===== OBTENER ARTISTAS DEL BACKEND =====
    useEffect(() => {

        if (seccion !== "artistas") return;

        const obtenerArtistas = async () => {

            setCargandoArtistas(true);
            setErrorArtistas("");

            try {

                const respuesta = await fetch(
                    "http://localhost:3000/artistas"
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron cargar los artistas"
                    );
                }

                const datos = await respuesta.json();

                if (!Array.isArray(datos)) {
                    throw new Error(
                        "El servidor no ha devuelto un listado válido de artistas"
                    );
                }

                setArtistas(datos);

            } catch (error) {

                console.error(
                    "Error al obtener artistas:",
                    error
                );

                setErrorArtistas(error.message);

            } finally {

                setCargandoArtistas(false);

            }

        };

        obtenerArtistas();

    }, [seccion]);


    // ===== PANEL DE ADMINISTRACIÓN =====
    return (

        <main className="panel-admin">

            <h1>Panel de administración</h1>

            <p>Gestión interna de Hache Studio</p>


            {/* ===== MENÚ DE ADMINISTRACIÓN ===== */}
            <nav>

                <button
                    type="button"
                    onClick={() => setSeccion("artistas")}
                >
                    Gestionar artistas
                </button>

                <button
                    type="button"
                    onClick={() => setSeccion("citas")}
                >
                    Gestionar citas
                </button>

                <button
                    type="button"
                    onClick={() => setSeccion("servicios")}
                >
                    Gestionar servicios
                </button>

            </nav>


            {/* ===== PANTALLA DE INICIO ===== */}
            {seccion === "inicio" && (

                <section>

                    <h2>Bienvenido al panel</h2>

                    <p>
                        Selecciona una sección para comenzar.
                    </p>

                </section>

            )}


            {/* ===== GESTIÓN DE ARTISTAS ===== */}
            {seccion === "artistas" && (

                <section>

                    <h2>Gestión de artistas</h2>


                    {/* MENSAJE DE CARGA */}
                    {cargandoArtistas && (

                        <p>Cargando artistas...</p>

                    )}


                    {/* MENSAJE DE ERROR */}
                    {errorArtistas && (

                        <p role="alert">{errorArtistas}</p>

                    )}


                    {/* LISTADO DE ARTISTAS */}
                    {!cargandoArtistas && !errorArtistas && (

                        <div>

                            <h3>Artistas registrados</h3>

                            {artistas.length === 0 ? (

                                <p>
                                    No hay artistas registrados.
                                </p>

                            ) : (

                                <ul>

                                    {artistas.map((artista) => (

                                        <li key={artista.id_usuario}>

                                            <strong>
                                                {artista.nombre}
                                            </strong>

                                            {" — "}

                                            {artista.especialidad}

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </div>

                    )}


                    {/* ===== FORMULARIO PARA CREAR ARTISTAS ===== */}
                    <AdminCrearArtista
                        token={token}
                        onArtistaCreado={() => {
                            setSeccion("inicio");
                        }}
                    />

                </section>

            )}


            {/* ===== GESTIÓN DE CITAS ===== */}
            {seccion === "citas" && (

                <section>

                    <h2>Gestión de citas</h2>

                    <p>
                        Aquí podremos consultar las citas
                        del estudio.
                    </p>

                </section>

            )}


            {/* ===== GESTIÓN DE SERVICIOS ===== */}
            {seccion === "servicios" && (

                <section>

                    <h2>Gestión de servicios</h2>

                    <p>
                        Aquí podremos crear, editar y
                        eliminar servicios.
                    </p>

                </section>

            )}

        </main>

    );

}

export default PanelAdmin;

