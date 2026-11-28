import { Link } from "react-router-dom";

// ===== PÁGINA PRINCIPAL DE HACHE STUDIO =====
function Inicio() {

    return (

        <main>

            {/* ===== INICIO ===== */}
            <section id="inicio">

                <h2>Bienvenido a Hache Studio</h2>

                <p>
                    Estudio de tatuajes, piercings y gemas dentales.
                </p>

                <Link to="/servicios">
                    Descubre nuestros servicios
                </Link>

            </section>

        </main>

    );

}

export default Inicio;