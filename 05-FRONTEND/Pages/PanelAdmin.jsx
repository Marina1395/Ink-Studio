
import { useState, useEffect } from "react";

import AdminGestionCitas from "./AdminGestionCitas";

import AdminGestionServicios from "./AdminGestionServicios";

import AdminGestionUsuarios from "./AdminGestionUsuarios";

import AdminGestionTrabajos from "./AdminGestionTrabajos";



/*----Componentes de administración----*/
import AdminCrearArtista from "./AdminCrearArtista";
import AdminEditarArtista from "./AdminEditarArtista";
import AdminBajaArtista from "./AdminBajaArtista";

function PanelAdmin({ token }) {

    // ===== SECCIÓN SELECCIONADA =====
    const [seccion, setSeccion] = useState("inicio");

    // ===== LISTADO DE ARTISTAS =====
    const [artistas, setArtistas] = useState([]);
    const [cargandoArtistas, setCargandoArtistas] = useState(false);
    const [errorArtistas, setErrorArtistas] = useState("");

    // ===== ARTISTA SELECCIONADO PARA EDITAR =====
    const [artistaEditar, setArtistaEditar] = useState(null);

    // ===== MENSAJE DE BAJA =====
    const [mensajeBaja, setMensajeBaja] = useState("");

    // ===== ACTUALIZACIÓN DEL LISTADO =====
    const [recargarArtistas, setRecargarArtistas] = useState(0);


    // ===== OBTENER ARTISTAS DEL BACKEND =====
    useEffect(() => {

        if (seccion !== "artistas") return;

        let cancelado = false;

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

                if (!cancelado) {
                    setArtistas(datos);
                }

            } catch (error) {

                console.error(
                    "Error al obtener artistas:",
                    error
                );

                if (!cancelado) {
                    setErrorArtistas(error.message);
                }

            } finally {

                if (!cancelado) {
                    setCargandoArtistas(false);
                }

            }

        };

        obtenerArtistas();

        return () => {
            cancelado = true;
        };

    }, [seccion, recargarArtistas]);


    // ===== ACTUALIZAR LISTADO =====
    const actualizarListado = () => {
        setRecargarArtistas((anterior) => anterior + 1);
    };


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

                <button
                    type="button"
                    onClick={() => setSeccion("usuarios")}
                >
                    Gestionar usuarios
                </button>

                <button
                    type="button"
                    onClick={() => setSeccion("trabajos")}
                >
                    Gestionar trabajos
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


                    {/* ===== MENSAJE DE BAJA CORRECTA ===== */}
                    {mensajeBaja && (
                        <p role="status">{mensajeBaja}</p>
                    )}


                    {/* ===== MENSAJE DE CARGA ===== */}
                    {cargandoArtistas && (
                        <p>Cargando artistas...</p>
                    )}


                    {/* ===== MENSAJE DE ERROR ===== */}
                    {errorArtistas && (
                        <p role="alert">{errorArtistas}</p>
                    )}


                    {/* ===== LISTADO DE ARTISTAS ===== */}
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

                                            {" "}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setArtistaEditar(artista);
                                                    setMensajeBaja("");
                                                }}
                                            >
                                                Editar
                                            </button>

                                            {" "}

                                            <AdminBajaArtista
                                                artista={artista}
                                                token={token}
                                                onArtistaDesactivado={() => {

                                                    setArtistaEditar(null);

                                                    setMensajeBaja(
                                                        `${artista.nombre} ha sido dado de baja correctamente.`
                                                    );

                                                    actualizarListado();

                                                }}
                                            />

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </div>

                    )}


                    {/* ===== FORMULARIO PARA EDITAR ARTISTA ===== */}
                    {artistaEditar && (

                        <AdminEditarArtista
                            artista={artistaEditar}
                            token={token}
                            onArtistaActualizado={() => {

                                setArtistaEditar(null);
                                setMensajeBaja("");
                                actualizarListado();

                            }}
                            onCancelar={() => {
                                setArtistaEditar(null);
                            }}
                        />

                    )}


                    {/* ===== FORMULARIO PARA CREAR ARTISTAS ===== */}
                    <AdminCrearArtista
                        token={token}
                        onArtistaCreado={() => {

                            setArtistaEditar(null);
                            setMensajeBaja("");
                            actualizarListado();

                        }}
                    />

                </section>

            )}


            {/* ===== GESTIÓN DE CITAS ===== */}
            {seccion === "citas" && (
                <AdminGestionCitas token={token} />
            )}


            {/* ===== GESTIÓN DE SERVICIOS ===== */}
            {seccion === "servicios" && (
                <AdminGestionServicios token={token} />
            )}

            {/* ===== GESTIÓN DE USUARIOS ===== */}
            {seccion === "usuarios" && (
                <AdminGestionUsuarios token={token} />
            )}

            {/* ===== GESTIÓN DE TRABAJOS ===== */}
            {seccion === "trabajos" && (
                <AdminGestionTrabajos token={token} />
            )}

        </main>

    );

}

export default PanelAdmin;
