
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useParams,
  useLocation
} from "react-router-dom";

import "./App.css";


// ===== PÁGINA DEL PERFIL DE UN ARTISTA =====
function PerfilArtista({ artistas }) {

  // Obtenemos el ID del artista desde la URL
  const { id } = useParams();

  // Buscamos al artista correspondiente
  const artista = artistas.find(
    (profesional) => profesional.id_usuario === Number(id)
  );


  // ===== ESTADOS PARA LA DISPONIBILIDAD =====

  // Fecha seleccionada por el cliente
  const [fecha, setFecha] = useState("");

  // Horarios disponibles recibidos del backend
  const [horarios, setHorarios] = useState([]);

  // Hora seleccionada por el cliente
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  // Controlamos si estamos consultando los horarios
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  // Guardamos posibles errores
  const [errorHorarios, setErrorHorarios] = useState("");

  // Controlamos si ya hemos consultado una fecha
  const [fechaConsultada, setFechaConsultada] = useState(false);


  // ===== CONSULTAR DISPONIBILIDAD =====
  const consultarDisponibilidad = async () => {

    if (!fecha || !artista) {
      return;
    }

    setCargandoHorarios(true);
    setErrorHorarios("");
    setHorarios([]);
    setHoraSeleccionada("");
    setFechaConsultada(false);

    try {

      // Hacemos la petición al backend
      const respuesta = await fetch(
        `http://localhost:3000/citas/disponibilidad?id_artista=${artista.id_usuario}&fecha=${fecha}`
      );

      // Comprobamos que la respuesta sea correcta
      if (!respuesta.ok) {
        throw new Error("Error al consultar disponibilidad");
      }

      // Convertimos la respuesta a JSON
      const datos = await respuesta.json();

      // Guardamos las horas disponibles
      setHorarios(datos.horarios_disponibles);

      // Indicamos que la consulta terminó correctamente
      setFechaConsultada(true);

    } catch (error) {

      console.error(
        "Error al consultar disponibilidad:",
        error
      );

      setErrorHorarios(
        "Ha ocurrido un error al consultar los horarios."
      );

    } finally {

      setCargandoHorarios(false);

    }

  };


  // ===== COMPROBAR SI EXISTE EL ARTISTA =====
  if (!artista) {

    return (
      <section id="perfil-artista">

        <h2>Artista no encontrado</h2>

        <Link to="/">
          Volver al inicio
        </Link>

      </section>
    );

  }


  return (

    <section id="perfil-artista">

      <h2>Perfil del artista</h2>

      {/* ===== DATOS DEL ARTISTA ===== */}

      <h3>{artista.nombre}</h3>

      <p>{artista.especialidad}</p>

      <p>{artista.descripcion}</p>


      {/* ===== TRABAJOS DEL ARTISTA ===== */}
      <div className="trabajos-artista">

        <h3>Trabajos realizados</h3>

        <p>
          Aquí podrás ver los trabajos realizados por {artista.nombre}.
        </p>

      </div>


      {/* ===== RESERVAR CITA ===== */}
      <div className="reserva-artista">

        <h3>Solicitar una cita</h3>

        <p>
          Selecciona una fecha para consultar los horarios disponibles.
        </p>


        {/* ===== SELECCIONAR FECHA ===== */}
        <label htmlFor="fecha-cita">
          Fecha de la cita:
        </label>

        <input
          type="date"
          id="fecha-cita"
          value={fecha}
          min={new Date().toLocaleDateString("sv-SE")}
          onChange={(evento) => {

            setFecha(evento.target.value);

            // Limpiamos los datos de la fecha anterior
            setHorarios([]);
            setHoraSeleccionada("");
            setFechaConsultada(false);
            setErrorHorarios("");

          }}
        />


        {/* ===== BOTÓN CONSULTAR ===== */}
        <button
          type="button"
          onClick={consultarDisponibilidad}
          disabled={!fecha || cargandoHorarios}
        >

          {cargandoHorarios
            ? "Consultando..."
            : "Consultar disponibilidad"}

        </button>


        {/* ===== MENSAJE DE ERROR ===== */}
        {errorHorarios && (

          <p role="alert">
            {errorHorarios}
          </p>

        )}


        {/* ===== MOSTRAR HORARIOS DISPONIBLES ===== */}
        {fechaConsultada && (

          <div className="horarios-disponibles">

            <h4>Horarios disponibles</h4>

            {horarios.length > 0 ? (

              <div className="lista-horarios">

                {horarios.map((hora) => (

                  <button
                    type="button"
                    key={hora}
                    className={
                      horaSeleccionada === hora
                        ? "hora-seleccionada"
                        : ""
                    }
                    aria-pressed={horaSeleccionada === hora}
                    onClick={() => setHoraSeleccionada(hora)}
                  >
                    {hora}
                  </button>

                ))}

              </div>

            ) : (

              <p>
                No hay horarios disponibles para esta fecha.
              </p>

            )}


            {/* ===== HORA SELECCIONADA ===== */}
            {horaSeleccionada && (

              <p className="resumen-hora">
                Has seleccionado las <strong>{horaSeleccionada}</strong>.
              </p>

            )}


            {/* ===== INFORMACIÓN DE LA RESERVA ===== */}
            <p>
              Los horarios permiten solicitar una cita.
              La reserva quedará pendiente hasta que
              el artista confirme su duración y disponibilidad.
            </p>

          </div>

        )}

      </div>


      {/* ===== VOLVER A LA PÁGINA PRINCIPAL ===== */}
      <Link to="/" state={{ volverAEquipo: true }}>
        Volver a nuestro equipo
      </Link>

    </section>

  );

}



// ===== COMPONENTE PRINCIPAL =====
function App() {

  // Guardamos la especialidad seleccionada
  const [filtro, setFiltro] = useState("Todos");

  // Guardamos los artistas recibidos del backend
  const [artistas, setArtistas] = useState([]);

  // Controlamos cuándo termina la carga de artistas
  const [cargando, setCargando] = useState(true);

  // Obtenemos la información de navegación de React Router
  const location = useLocation();


  // ===== VOLVER A LA SECCIÓN DEL EQUIPO =====
  useEffect(() => {

    if (
      location.pathname === "/" &&
      location.state?.volverAEquipo
    ) {

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

        // Convertimos la respuesta JSON
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

    // Si seleccionamos "Todos", mostramos todos
    if (filtro === "Todos") {
      return true;
    }

    // Convertimos la especialidad a minúsculas
    const especialidad = (profesional.especialidad || "").toLowerCase();

    // Filtramos según la categoría
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

              {/* ===== LOGOTIPO HACHE STUDIO ===== */}
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

                    {/* Especialidad */}
                    <p>{profesional.especialidad}</p>

                    {/* Descripción */}
                    <p>{profesional.descripcion}</p>

                    {/* Navegación al perfil */}
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
                Descubre los trabajos realizados por nuestros artistas.
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
