
import { useState, useEffect } from "react";
import "./App.css";

function App() {

  // Guardamos la especialidad seleccionada
  const [filtro, setFiltro] = useState("Todos");

  // Guardamos los artistas recibidos del backend
  const [artistas, setArtistas] = useState([]);

  // Guardamos el artista seleccionado al pulsar "Ver perfil"
  const [artistaSeleccionado, setArtistaSeleccionado] = useState(null);


  // ===== OBTENER ARTISTAS DESDE EL BACKEND =====
  useEffect(() => {

    const obtenerArtistas = async () => {

      try {

        // Hacemos una petición al backend
        const respuesta = await fetch("http://localhost:3000/artistas");

        // Comprobamos que la petición haya sido correcta
        if (!respuesta.ok) {
          throw new Error("Error al obtener los artistas");
        }

        // Convertimos la respuesta JSON a datos de JavaScript
        const datos = await respuesta.json();

        // Guardamos los artistas recibidos
        setArtistas(datos);

        // Comprobamos qué artistas hemos recibido
        console.log("Artistas recibidos del backend:", datos);

      } catch (error) {

        console.error("Error al cargar los artistas:", error);

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

    <div>

      {/* ===== CABECERA DE LA WEB ===== */}
      <header>

        <h1>Hache Studio</h1>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#equipo">Nuestro equipo</a>
          <a href="#trabajos">Trabajos</a>
          <a href="#contacto">Contacto</a>
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

              {/* Guardamos el artista seleccionado */}
              <button
                onClick={() => setArtistaSeleccionado(profesional)}
              >
                Ver perfil
              </button>

            </div>

          ))}

        </div>

      </section>


      {/* ===== PERFIL DEL ARTISTA SELECCIONADO ===== */}
      {artistaSeleccionado && (

        <section id="perfil-artista">

          <h2>Perfil del artista</h2>

          {/* Nombre del artista seleccionado */}
          <h3>{artistaSeleccionado.nombre}</h3>

          {/* Especialidad del artista seleccionado */}
          <p>{artistaSeleccionado.especialidad}</p>

          {/* Descripción del artista seleccionado */}
          <p>{artistaSeleccionado.descripcion}</p>

          {/* Cerramos el perfil */}
          <button
            onClick={() => setArtistaSeleccionado(null)}
          >
            Cerrar perfil
          </button>

        </section>

      )}


      {/* ===== SECCIÓN DE TRABAJOS ===== */}
      <section id="trabajos">

        <h2>Nuestros trabajos</h2>

        <p>
          Descubre los trabajos realizados por nuestros artistas
        </p>

      </section>

    </div>

  );

}

export default App;
