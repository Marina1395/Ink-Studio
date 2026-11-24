import { Link } from "react-router-dom";



function Servicios() {

    return (

        <section id="servicios" className="servicios-cyberpunk">

            <h2>NUESTROS SERVICIOS</h2>

            <div className="servicios-contenedor">

                {/* TARJETA DE TATUAJES */}

                <article className="servicio-tarjeta servicio-tatuajes">

                    <h3>Tatuajes</h3>

                    <p>
                        Diseños personalizados realizados
                        por nuestros artistas.
                    </p>

                </article>


                {/* TARJETA DE PIERCINGS */}

                <article className="servicio-tarjeta servicio-piercings">

                    <h3>Piercings</h3>

                    <p>
                        Perforaciones profesionales
                        adaptadas a tu estilo.
                    </p>

                </article>


                {/* TARJETA DE GEMAS DENTALES */}

                <article className="servicio-tarjeta servicio-gemas">

                    <h3>Gemas dentales</h3>

                    <p>
                        Un toque de brillo para tu sonrisa.
                    </p>

                </article>

            </div>


            {/* ENLACE AL EQUIPO DE ARTISTAS */}

            <Link to="/equipo" className="servicios-enlace">

                CONOCE A NUESTRO EQUIPO →

            </Link>

        </section>

    );

}

export default Servicios;