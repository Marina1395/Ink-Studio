import { Link } from "react-router-dom";

// ===== PÁGINA DE NUESTRO EQUIPO =====
function Equipo({ artistas, cargando, filtro, setFiltro }) {

    // ===== FILTRAR ARTISTAS POR ESPECIALIDAD =====
    const profesionalesFiltrados = artistas.filter((profesional) => {

        if (filtro === "Todos") {
            return true;
        }

        const especialidad = (
            profesional.especialidad || ""
        ).toLowerCase();

        if (filtro === "Tatuajes") {
            return especialidad.includes("tatuaje");
        }

        if (filtro === "Piercings") {
            return especialidad.includes("piercing");
        }

        if (filtro === "Gemas dentales") {
            return especialidad.includes("gemas dentales");
        }

        return false;

    });


    // ===== INTERFAZ DE NUESTRO EQUIPO =====
    return (

        <main>

            <section id="equipo">

                <h2>Conoce a nuestro equipo</h2>


                {/* ===== FILTROS DE ARTISTAS ===== */}
                <div className="filtros-equipo">

                    <button
                        type="button"
                        onClick={() => setFiltro("Todos")}
                    >
                        Todos
                    </button>

                    <button
                        type="button"
                        onClick={() => setFiltro("Tatuajes")}
                    >
                        Tatuajes
                    </button>

                    <button
                        type="button"
                        onClick={() => setFiltro("Piercings")}
                    >
                        Piercings
                    </button>

                    <button
                        type="button"
                        onClick={() => setFiltro("Gemas dentales")}
                    >
                        Gemas dentales
                    </button>

                </div>


                {/* ===== TARJETAS DE ARTISTAS ===== */}
                {cargando ? (

                    <p>Cargando profesionales...</p>

                ) : (

                    <div className="equipo-container">

                        {profesionalesFiltrados.map((profesional) => (

                            <div
                                className="profesional"
                                key={profesional.id_usuario}
                            >

                                {/* ===== FOTOGRAFÍA DEL ARTISTA ===== */}
                                <div className="profesional-foto">

                                    {(profesional.imagen_tarjeta || profesional.imagen) && (

                                        <img
                                            src={profesional.imagen_tarjeta || profesional.imagen}
                                            alt={`Fotografía de ${profesional.nombre}`}
                                            className="foto-tarjeta-artista"
                                        />

                                    )}

                                </div>


                                {/* ===== INFORMACIÓN DEL ARTISTA ===== */}
                                <div className="profesional-info">

                                    <h3>{profesional.nombre}</h3>

                                    <p className="profesional-especialidad">
                                        {profesional.especialidad}
                                    </p>

                                    <p className="profesional-descripcion">
                                        {profesional.descripcion}
                                    </p>


                                    {/* ===== BOTÓN VER PERFIL ===== */}
                                    <Link
                                        className="profesional-boton"
                                        to={`/artistas/${profesional.id_usuario}`}
                                    >
                                        VER PERFIL <span aria-hidden="true">→</span>
                                    </Link>

                                </div>

                            </div>

                        ))}


                        {/* ===== LISTADO VACÍO ===== */}
                        {profesionalesFiltrados.length === 0 && (

                            <p>
                                No hay profesionales disponibles
                                para esta especialidad.
                            </p>

                        )}

                    </div>

                )}

            </section>

        </main>

    );

}

export default Equipo;