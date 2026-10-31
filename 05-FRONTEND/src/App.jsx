
import { useState, useEffect } from "react";

import {
  Routes,
  Route,
  Link,
  useParams,
  useLocation
} from "react-router-dom";

import "./App.css";

const API_URL = "http://localhost:3000";


// ===== PERFIL DE UN ARTISTA =====
function PerfilArtista({ artistas, token, usuario }) {

  const { id } = useParams();

  const artista = artistas.find(
    (profesional) => profesional.id_usuario === Number(id)
  );

  // ===== ESTADOS DE LA RESERVA =====
  const [fecha, setFecha] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState("");
  const [fechaConsultada, setFechaConsultada] = useState(false);

  // Servicios que existen en PostgreSQL
  const [servicios, setServicios] = useState([]);
  const [idServicio, setIdServicio] = useState("");

  // Estado del envío de la solicitud
  const [enviandoCita, setEnviandoCita] = useState(false);
  const [errorCita, setErrorCita] = useState("");
  const [mensajeCita, setMensajeCita] = useState("");


  // ===== CARGAR SERVICIOS =====
  useEffect(() => {

    const obtenerServicios = async () => {

      try {

        const respuesta = await fetch(
          `${API_URL}/servicios`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los servicios");
        }

        const datos = await respuesta.json();

        setServicios(Array.isArray(datos) ? datos : []);

      } catch (error) {

        console.error("Error al cargar servicios:", error);
        setErrorCita("No se han podido cargar los servicios.");

      }

    };

    obtenerServicios();

  }, []);


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
    setErrorCita("");
    setMensajeCita("");

    try {

      const respuesta = await fetch(
        `${API_URL}/citas/disponibilidad?id_artista=${artista.id_usuario}&fecha=${fecha}`
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "Error al consultar disponibilidad"
        );
      }

      setHorarios(
        Array.isArray(datos.horarios_disponibles)
          ? datos.horarios_disponibles
          : []
      );

      setFechaConsultada(true);

    } catch (error) {

      console.error(
        "Error al consultar disponibilidad:",
        error
      );

      setErrorHorarios(error.message);

    } finally {

      setCargandoHorarios(false);

    }

  };


  // ===== SOLICITAR CITA =====
  const solicitarCita = async () => {

    setErrorCita("");
    setMensajeCita("");

    if (!token) {

      setErrorCita(
        "Debes iniciar sesión para solicitar una cita."
      );

      return;

    }

    if (usuario?.rol !== "cliente") {

      setErrorCita(
        "Debes iniciar sesión con una cuenta de cliente."
      );

      return;

    }

    if (!fecha || !horaSeleccionada || !idServicio || !artista) {

      setErrorCita(
        "Selecciona un servicio, una fecha y una hora."
      );

      return;

    }

    setEnviandoCita(true);

    try {

      const respuesta = await fetch(`${API_URL}/citas`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({

          id_artista: artista.id_usuario,
          id_servicio: Number(idServicio),
          fecha: fecha,
          hora: horaSeleccionada

        })

      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {

        if (respuesta.status === 401) {
          throw new Error(
            "Tu sesión ha caducado. Inicia sesión de nuevo."
          );
        }

        throw new Error(
          datos.error || "No se pudo solicitar la cita."
        );

      }

      setMensajeCita(
        `Solicitud registrada correctamente. Número de cita: ${datos.id_cita}. Está pendiente de confirmación.`
      );

      // Limpiamos la selección después de guardar
      setHoraSeleccionada("");
      setFechaConsultada(false);
      setHorarios([]);

    } catch (error) {

      console.error("Error al solicitar cita:", error);
      setErrorCita(error.message);

    } finally {

      setEnviandoCita(false);

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
          Selecciona un servicio y una fecha para consultar
          los horarios disponibles.
        </p>

        {/* ===== SELECCIONAR SERVICIO ===== */}
        <label htmlFor="servicio-cita">
          Servicio:
        </label>

        <select
          id="servicio-cita"
          value={idServicio}
          onChange={(evento) => {

            setIdServicio(evento.target.value);
            setErrorCita("");
            setMensajeCita("");

          }}
        >

          <option value="">
            Selecciona un servicio
          </option>

          {servicios.map((servicio) => (

            <option
              key={servicio.id_servicio}
              value={servicio.id_servicio}
            >
              {servicio.nombre}
            </option>

          ))}

        </select>


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

            setHorarios([]);
            setHoraSeleccionada("");
            setFechaConsultada(false);
            setErrorHorarios("");
            setErrorCita("");
            setMensajeCita("");

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


        {/* ===== ERRORES DE DISPONIBILIDAD ===== */}
        {errorHorarios && (

          <p role="alert">
            {errorHorarios}
          </p>

        )}


        {/* ===== HORARIOS DISPONIBLES ===== */}
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
                    onClick={() => {

                      setHoraSeleccionada(hora);
                      setErrorCita("");
                      setMensajeCita("");

                    }}
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
                Has seleccionado las{" "}
                <strong>{horaSeleccionada}</strong>.
              </p>

            )}


            {/* ===== INFORMACIÓN DE LA RESERVA ===== */}
            <p>
              Los horarios permiten solicitar una cita.
              La reserva quedará pendiente hasta que
              el artista confirme su duración y disponibilidad.
            </p>


            {/* ===== BOTÓN SOLICITAR CITA ===== */}
            {horaSeleccionada && (

              <button
                type="button"
                onClick={solicitarCita}
                disabled={
                  enviandoCita ||
                  !idServicio ||
                  !token ||
                  usuario?.rol !== "cliente"
                }
              >

                {enviandoCita
                  ? "Enviando solicitud..."
                  : "Solicitar cita"}

              </button>

            )}

            {!token && horaSeleccionada && (

              <p>
                Inicia sesión para poder solicitar tu cita.
              </p>

            )}

          </div>

        )}


        {/* ===== RESULTADO DE LA SOLICITUD ===== */}
        {errorCita && (

          <p role="alert">
            {errorCita}
          </p>

        )}

        {mensajeCita && (

          <p role="status">
            {mensajeCita}
          </p>

        )}

      </div>


      {/* ===== VOLVER AL EQUIPO ===== */}
      <Link to="/" state={{ volverAEquipo: true }}>
        Volver a nuestro equipo
      </Link>

    </section>

  );

}



// ===== COMPONENTE PRINCIPAL =====
function App() {

  // ===== FILTRO DE ARTISTAS =====
  const [filtro, setFiltro] = useState("Todos");

  // ===== ARTISTAS =====
  const [artistas, setArtistas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ===== LOGIN =====
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Guardamos la autenticación en memoria.
  // Al recargar la página será necesario iniciar sesión de nuevo.
  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [iniciandoSesion, setIniciandoSesion] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [mensajeLogin, setMensajeLogin] = useState("");

  const location = useLocation();


  // ===== INICIAR SESIÓN =====
  const iniciarSesion = async (evento) => {

    evento.preventDefault();

    setErrorLogin("");
    setMensajeLogin("");
    setIniciandoSesion(true);

    try {

      const respuesta = await fetch(`${API_URL}/usuarios/login`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: email.trim(),
          contrasena: contrasena
        })

      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {

        throw new Error(
          datos.error || "No se pudo iniciar sesión."
        );

      }

      if (!datos.token || !datos.usuario) {

        throw new Error(
          "El servidor no ha devuelto los datos de acceso."
        );

      }

      setToken(datos.token);
      setUsuario(datos.usuario);

      // No mantenemos la contraseña escrita en el formulario
      setContrasena("");

      setMensajeLogin(
        `Has iniciado sesión como ${datos.usuario.nombre}.`
      );

    } catch (error) {

      console.error("Error al iniciar sesión:", error);

      setErrorLogin(error.message);

    } finally {

      setIniciandoSesion(false);

    }

  };


  // ===== CERRAR SESIÓN =====
  const cerrarSesion = () => {

    setToken("");
    setUsuario(null);
    setEmail("");
    setContrasena("");
    setErrorLogin("");
    setMensajeLogin("");

  };


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


  // ===== OBTENER ARTISTAS =====
  useEffect(() => {

    const obtenerArtistas = async () => {

      try {

        const respuesta = await fetch(
          `${API_URL}/artistas`
        );

        if (!respuesta.ok) {
          throw new Error("Error al obtener los artistas");
        }

        const datos = await respuesta.json();

        setArtistas(datos);

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

        setCargando(false);

      }

    };

    obtenerArtistas();

  }, []);


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


  // ===== FORMULARIO DE LOGIN =====
  const formularioLogin = (

    <div className="login-usuario">

      {usuario ? (

        <div>

          <p>
            Sesión iniciada como{" "}
            <strong>{usuario.nombre}</strong>
          </p>

          <button
            type="button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>

      ) : (

        <form onSubmit={iniciarSesion}>

          <h3>Iniciar sesión</h3>

          <label htmlFor="email-login">
            Correo electrónico:
          </label>

          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(evento) =>
              setEmail(evento.target.value)
            }
            autoComplete="email"
            required
          />

          <label htmlFor="contrasena-login">
            Contraseña:
          </label>

          <input
            id="contrasena-login"
            type="password"
            value={contrasena}
            onChange={(evento) =>
              setContrasena(evento.target.value)
            }
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={iniciandoSesion}
          >
            {iniciandoSesion
              ? "Iniciando sesión..."
              : "Entrar"}
          </button>

        </form>

      )}

      {errorLogin && (
        <p role="alert">{errorLogin}</p>
      )}

      {mensajeLogin && (
        <p role="status">{mensajeLogin}</p>
      )}

    </div>

  );


  return (

    <Routes>

      {/* ===== PÁGINA PRINCIPAL ===== */}
      <Route
        path="/"
        element={

          <div>

            {/* ===== CABECERA ===== */}
            <header>

              <img
                src="/artistas/logo_hache.png"
                alt="Hache Studio"
                className="logo-hache"
              />

              <nav className="nav-gotico">

                <span
                  className="filigrana-lateral filigrana-izquierda"
                  aria-hidden="true"
                ></span>

                <a href="#inicio">Inicio</a>
                <a href="#servicios">Servicios</a>
                <a href="#equipo">Nuestro equipo</a>
                <a href="#trabajos">Trabajos</a>
                <a href="#contacto">Contacto</a>

                <span
                  className="filigrana-lateral filigrana-derecha"
                  aria-hidden="true"
                ></span>

              </nav>

            </header>


            {/* ===== INICIO ===== */}
            <section id="inicio">

              <h2>Bienvenido a Hache Studio</h2>

              <p>
                Estudio de tatuajes, piercings y gemas dentales.
              </p>

              <a href="#servicios">
                Descubre nuestros servicios
              </a>

            </section>


            {/* ===== LOGIN ===== */}
            <section id="acceso-clientes">

              {formularioLogin}

            </section>


            {/* ===== SERVICIOS ===== */}
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


            {/* ===== EQUIPO ===== */}
            <section id="equipo">

              <h2>Conoce a nuestro equipo</h2>

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
              <div className="equipo-container">

                {profesionalesFiltrados.map((profesional) => (

                  <div
                    className="profesional"
                    key={profesional.id_usuario}
                  >

                    <h3>{profesional.nombre}</h3>

                    <p>{profesional.especialidad}</p>

                    <p>{profesional.descripcion}</p>

                    <Link
                      to={`/artistas/${profesional.id_usuario}`}
                    >
                      Ver perfil
                    </Link>

                  </div>

                ))}

              </div>

            </section>


            {/* ===== TRABAJOS ===== */}
            <section id="trabajos">

              <h2>Nuestros trabajos</h2>

              <p>
                Descubre los trabajos realizados por nuestros artistas.
              </p>

            </section>

          </div>

        }
      />


      {/* ===== PERFIL DEL ARTISTA ===== */}
      <Route
        path="/artistas/:id"
        element={

          cargando ? (

            <p>Cargando perfil del artista...</p>

          ) : (

            <div>

              {/* Login también disponible en el perfil */}
              {formularioLogin}

              <PerfilArtista
                artistas={artistas}
                token={token}
                usuario={usuario}
              />

            </div>

          )

        }
      />

    </Routes>

  );

}

export default App;
