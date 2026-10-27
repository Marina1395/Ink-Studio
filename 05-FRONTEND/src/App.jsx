
import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import "./App.css";


// ===== PÁGINA DEL PERFIL DE UN ARTISTA =====
function PerfilArtista({ artistas }) {

  // Obtenemos el ID del artista desde la URL
  const { id } = useParams();

  // Buscamos al artista correspondiente
  const artista = artistas.find(
    (profesional) => profesional.id_usuario === Number(id)
  );

  // Si todavía no tenemos sus datos
  if (!artista) {
    return (
      <section id="perfil-artista">

        <h2>Artista no encontrado</h2>

        <Link to="/">Volver al inicio</Link>

      </section>
    );
  }

  return (
    <section id="perfil-artista">

      <h2>Perfil del artista</h2>

      {/* Nombre */}
      <h3>{artista.nombre}</h3>

      {/* Especialidad */}
      <p>{artista.especialidad}</p>

      {/* Descripción */}
      <p>{artista.descripcion}</p>


      {/* ===== TRABAJOS DEL ARTISTA ===== */}
      <div className="trabajos-artista">

        <h3>Trabajos realizados</h3>

        <p>
          Aquí podrás ver los trabajos realizados por {artista.nombre}.
        </p>

      </div>

      <Link to="/" state={{ volverAEquipo: true }}>
        Volver a nuestro equipo
      </Link>

    </section>
  );
}


function App() {

  // Guardamos la especialidad seleccionada
  const [filtro, setFiltro] = useState("Todos");

  // Guardamos los artistas recibidos del backend
  const [artistas, setArtistas] = useState([]);

  // Controlamos cuándo termina la carga de artistas
  const [cargando, setCargando] = useState(true);

  // Obtenemos la información de navegación de React Router
  const location = useLocation();

  // Cuando volvemos desde un perfil, bajamos a "Nuestro equipo"
  useEffect(() => {

    if (location.pathname === "/" && location.state?.volverAEquipo) {

      document.getElementById("equipo")?.scrollIntoView({
        behavior: "smooth"
      });

    }

  }, [location]);


  // ===== OBTENER ARTISTAS DESDE EL BACKEND =====
  useEffect(() => {

    const obtenerArtistas = async () => {

      try {

        // Hacemos una petición al backend
        const respuesta = await fetch(
          "http://localhost:3000/artistas"
        );

        // Comprobamos que la petición haya sido correcta
        if (!respuesta.ok) {
          throw new Error("Error al obtener los artistas");
        }

        // Convertimos la respuesta JSON a datos de JavaScript
        const datos = await respuesta.json();

        // Guardamos los artistas recibidos
        setArtistas(datos);

        // Mostramos los datos en la consola
        console.log(
          "Artistas recibidos del backend:",
          datos
        );

      } catch (error) {

        console.error(
          "Error al cargar los artistas:",
          error
        );

      } finally {

        // Indicamos que la carga ha terminado
        setCargando(false);

      }

    };

    obtenerArtistas();

  }, []);


  // ===== FILTRAR ARTISTAS POR ESPECIALIDAD =====
  const profesionalesFiltrados = artistas.filter((profesional) => {

    // Si seleccionamos "Todos", mostramos todos los artistas
    if (filtro === "Todos") {
      return true;
    }

    // Convertimos la especialidad a minúsculas
    const especialidad = profesional.especialidad.toLowerCase();

    // Comprobamos qué categoría hemos seleccionado
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


  return (

    <Routes>

      {/* ===== RUTA DE LA PÁGINA PRINCIPAL ===== */}
      <Route
        path="/"
        element={

          <div>

            {/* ===== CABECERA DE LA WEB ===== */}
            <header>

              {/*====LOGOTIPO HACHE STUDIO====*/}
              <img

                src="/artistas/logo_hache.png"
                alt="Hache Studio"
                className="logo-hache"

              />


              {/* ===== MENÚ GÓTICO HACHE STUDIO ===== */}

              <nav className="nav-gotico">

                {/* Filigrana izquierda */}
                <span
                  className="filigrana-lateral filigrana-izquierda"
                  aria-hidden="true"
                ></span>

                <a href="#inicio">Inicio</a>
                <a href="#servicios">Servicios</a>
                <a href="#equipo">Nuestro equipo</a>
                <a href="#trabajos">Trabajos</a>
                <a href="#contacto">Contacto</a>

                {/* Filigrana derecha */}
                <span
                  className="filigrana-lateral filigrana-derecha"
                  aria-hidden="true"
                ></span>

              </nav>

            </header>


            {/* ===== SECCIÓN DE INICIO ===== */}
            <section id="inicio">

              <h2>Bienvenido a Hache Studio</h2>

              <p>
                Estudio de tatuajes, piercings y gemas dentales.
              </p>

              <a href="#servicios">
                Descubre nuestros servicios
              </a>

            </section>


            {/* ===== SECCIÓN DE SERVICIOS ===== */}
            <section id="servicios">

              <h2>Nuestros servicios</h2>

              <div className="servicios-container">

                <div className="servicio">

                  <h3>Tatuajes</h3>

                  <p>
                    Diseños personalizados realizados por nuestros artistas.
                  </p>

                </div>

                <div className="servicio">

                  <h3>Piercings</h3>

                  <p>
                    Perforaciones profesionales adaptadas a tu estilo.
                  </p>

                </div>

                <div className="servicio">

                  <h3>Gemas dentales</h3>

                  <p>
                    Un toque de brillo para tu sonrisa.
                  </p>

                </div>

              </div>

            </section>


            {/* ===== SECCIÓN DE PROFESIONALES ===== */}
            <section id="equipo">

              <h2>Conoce a nuestro equipo</h2>


              {/* ===== BOTONES PARA FILTRAR PROFESIONALES ===== */}
              <div className="filtros-equipo">

                <button onClick={() => setFiltro("Todos")}>
                  Todos
                </button>

                <button onClick={() => setFiltro("Tatuajes")}>
                  Tatuajes
                </button>

                <button onClick={() => setFiltro("Piercings")}>
                  Piercings
                </button>

                <button onClick={() => setFiltro("Gemas dentales")}>
                  Gemas dentales
                </button>

              </div>


              {/* ===== TARJETAS DE LOS ARTISTAS ===== */}
              <div className="equipo-container">

                {profesionalesFiltrados.map((profesional) => (

                  <div
                    className="profesional"
                    key={profesional.id_usuario}
                  >

                    {/* Nombre del artista */}
                    <h3>{profesional.nombre}</h3>

                    {/* Especialidad del artista */}
                    <p>{profesional.especialidad}</p>

                    {/* Descripción profesional */}
                    <p>{profesional.descripcion}</p>

                    {/* Navegación a la página del artista */}
                    <Link
                      to={`/artistas/${profesional.id_usuario}`}
                    >
                      Ver perfil
                    </Link>

                  </div>

                ))}

              </div>

            </section>


            {/* ===== SECCIÓN DE TRABAJOS ===== */}
            <section id="trabajos">

              <h2>Nuestros trabajos</h2>

              <p>
                Descubre los trabajos realizados por nuestros artistas
              </p>

            </section>

          </div>

        }
      />


      {/* ===== RUTA DEL PERFIL DE CADA ARTISTA ===== */}
      <Route
        path="/artistas/:id"
        element={
          cargando ? (
            <p>Cargando perfil del artista...</p>
          ) : (
            <PerfilArtista artistas={artistas} />
          )
        }
      />

    </Routes>

  );

}

export default App;
