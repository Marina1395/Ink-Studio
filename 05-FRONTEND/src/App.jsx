
import { useState, useEffect } from "react";
import PerfilArtista from "./components/PerfilArtista";

import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import "./App.css";

const API_URL = "http://localhost:3000";




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
