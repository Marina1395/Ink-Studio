import { useState, useEffect } from "react";

import Servicios from "../Pages/Servicios";

/*----Importamos la página de trabajos----*/
import Trabajos from "../Pages/Trabajos";

/*----Importamos la página de contacto----*/
import Contacto from "../Pages/Contacto";

import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate
} from "react-router-dom";

import PerfilArtista from "./components/PerfilArtista";

import Login from "../Pages/Login";

/*----Importamos el panel de administración----*/
import PanelAdmin from "../Pages/PanelAdmin";

/*----Importamos la página de registro de clientes----*/
import Registro from "../Pages/Registro";

/*----Importamos las páginas de recuperación de contraseña----*/
import RecuperarContrasena from "../Pages/RecuperarContrasena";
import RestablecerContrasena from "../Pages/RestablecerContrasena";

/*----Importamos la página de citas del cliente----*/
import MisCitas from "../Pages/Miscitas";

/*----Importamos el componente de baja voluntaria del cliente----*/
import BajaCliente from "../Pages/BajaCliente";

/*----Importamos el panel de gestión de citas para artistas----*/
import MisCitasArtista from "../Pages/MisCitasArtista";

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


  // ===== PERSISTENCIA DE LA SESIÓN =====
  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [verificandoSesion, setVerificandoSesion] = useState(true);

  const [iniciandoSesion, setIniciandoSesion] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [mensajeLogin, setMensajeLogin] = useState("");


  // ===== RECUPERAR Y VERIFICAR LA SESIÓN =====
  useEffect(() => {

    const controlador = new AbortController();

    const recuperarSesion = async () => {

      try {

        // Recuperamos los datos guardados en la pestaña.
        const sesionGuardada = sessionStorage.getItem("hacheSesion");

        if (!sesionGuardada) {
          return;
        }

        const sesion = JSON.parse(sesionGuardada);

        // Comprobamos que existen los datos necesarios.
        if (
          typeof sesion.token !== "string" ||
          !sesion.token ||
          !Number.isSafeInteger(sesion.id_usuario) ||
          sesion.id_usuario <= 0
        ) {

          throw new Error("Sesión incorrecta.");

        }

        // Consultamos al backend para verificar el token.
        const respuesta = await fetch(
          `${API_URL}/usuarios/${sesion.id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${sesion.token}`
            },

            signal: controlador.signal
          }
        );

        if (!respuesta.ok) {

          throw new Error(
            "No se pudo validar la sesión."
          );

        }

        const usuarioActual = await respuesta.json();

        // Comprobamos la identidad y el rol del usuario.
        if (
          usuarioActual.id_usuario !== sesion.id_usuario ||
          !["cliente", "artista", "admin"].includes(usuarioActual.rol)
        ) {

          throw new Error("Usuario no válido.");

        }

        if (controlador.signal.aborted) {
          return;
        }

        // Recuperamos la sesión validada por el backend.
        setToken(sesion.token);
        setUsuario(usuarioActual);

      } catch (error) {

        if (controlador.signal.aborted) {
          return;
        }

        // Eliminamos los datos de una sesión no válida.
        sessionStorage.removeItem("hacheSesion");

        setToken("");
        setUsuario(null);

        console.error(
          "Error al recuperar la sesión:",
          error
        );

      } finally {

        if (!controlador.signal.aborted) {

          setVerificandoSesion(false);

        }

      }

    };

    recuperarSesion();

    // Cancelamos la petición si el componente se desmonta.
    return () => {

      controlador.abort();

    };

  }, []);


  // ===== INICIAR SESIÓN =====
  const iniciarSesion = async (evento) => {

    evento.preventDefault();

    setErrorLogin("");
    setMensajeLogin("");
    setIniciandoSesion(true);

    try {

      const respuesta = await fetch(
        `${API_URL}/usuarios/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            contrasena: contrasena
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {

        throw new Error(
          datos.error || "No se pudo iniciar sesión."
        );

      }

      if (
        !datos.token ||
        !datos.usuario ||
        !Number.isSafeInteger(datos.usuario.id_usuario) ||
        datos.usuario.id_usuario <= 0
      ) {

        throw new Error(
          "El servidor no ha devuelto los datos de acceso."
        );

      }

      // Guardamos únicamente el token y el identificador.
      // Así podemos recuperar la sesión al recargar la página.
      sessionStorage.setItem(
        "hacheSesion",
        JSON.stringify({
          token: datos.token,
          id_usuario: datos.usuario.id_usuario
        })
      );

      setToken(datos.token);
      setUsuario(datos.usuario);

      // Limpiamos la contraseña después del acceso.
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

    // Eliminamos la sesión almacenada en el navegador.
    sessionStorage.removeItem("hacheSesion");

    setToken("");
    setUsuario(null);
    setEmail("");
    setContrasena("");
    setErrorLogin("");
    setMensajeLogin("");

  };


  // ===== OBTENER ARTISTAS =====
  useEffect(() => {

    const obtenerArtistas = async () => {

      try {

        const respuesta = await fetch(
          `${API_URL}/artistas`
        );

        if (!respuesta.ok) {

          throw new Error(
            "Error al obtener los artistas"
          );

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

    <Login
      usuario={usuario}
      email={email}
      setEmail={setEmail}
      contrasena={contrasena}
      setContrasena={setContrasena}
      iniciarSesion={iniciarSesion}
      cerrarSesion={cerrarSesion}
      iniciandoSesion={iniciandoSesion}
      errorLogin={errorLogin}
      mensajeLogin={mensajeLogin}
    />

  );


  // ===== CABECERA Y MENÚ DE NAVEGACIÓN =====
  const cabecera = (

    <header>

      <img
        src="/hache-cabecera.png"
        alt="Hache Studio - Cabecera"
        className="cabecera-hache"
      />

      <nav className="nav-gotico">


        {/* ===== MENÚ DE NAVEGACIÓN ENTRE PÁGINAS ===== */}

        <NavLink to="/" end>
          Inicio
        </NavLink>

        <NavLink to="/servicios">
          Servicios
        </NavLink>

        <NavLink to="/equipo">
          Nuestro equipo
        </NavLink>

        <NavLink to="/trabajos">
          Trabajos
        </NavLink>

        <NavLink to="/contacto">
          Contacto
        </NavLink>


        {/*----Acceso a las citas de los clientes autenticados----*/}
        {usuario?.rol === "cliente" && (

          <NavLink to="/mis-citas">
            Mis citas
          </NavLink>

        )}


        {/*----Acceso al panel de citas de los artistas autenticados----*/}
        {usuario?.rol === "artista" && (

          <NavLink to="/gestion-citas">
            Gestión de citas
          </NavLink>

        )}


        {/*----Acceso al panel de administración----*/}
        {usuario?.rol === "admin" && (

          <NavLink to="/admin">
            Administración
          </NavLink>

        )}


        {/* ===== ACCESO DE USUARIOS ===== */}
        {usuario ? (

          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>

        ) : (

          <NavLink to="/login">
            Iniciar sesión
          </NavLink>

        )}

      </nav>

    </header>

  );


  // ===== MOSTRAR PÁGINAS DE LA APLICACIÓN =====

  // Esperamos a verificar la sesión antes de mostrar las rutas.
  // Evitamos redirecciones al login durante la comprobación.
  if (verificandoSesion) {

    return <p>Comprobando sesión...</p>;

  }


  return (

    <div className="app-hache">

      {/* ===== CABECERA COMÚN ===== */}
      {cabecera}

      <Routes>


        {/*----Panel privado de administración----*/}
        <Route
          path="/admin"
          element={

            usuario?.rol === "admin" && token ? (

              <PanelAdmin token={token} />

            ) : (

              <Navigate to="/login" replace />

            )

          }
        />


        {/*----Panel privado de gestión de citas para artistas----*/}
        <Route
          path="/gestion-citas"
          element={

            usuario?.rol === "artista" && token ? (

              <main>

                <MisCitasArtista token={token} />

              </main>

            ) : (

              <Navigate to="/login" replace />

            )

          }
        />


        {/*----Página de citas del cliente autenticado----*/}
        <Route
          path="/mis-citas"
          element={

            usuario?.rol === "cliente" && token ? (

              <main>

                <MisCitas token={token} />

                {/*----Gestión de la baja voluntaria del cliente----*/}
                <BajaCliente
                  token={token}
                  usuario={usuario}
                  cerrarSesion={cerrarSesion}
                />

              </main>

            ) : (

              <Navigate to="/login" replace />

            )

          }
        />


        {/* ===== PÁGINA INDEPENDIENTE DE REGISTRO ===== */}
        <Route
          path="/registro"
          element={

            <main>

              <section id="registro-clientes">

                <Registro />

              </section>

            </main>

          }
        />


        {/* ===== PÁGINA INDEPENDIENTE DE LOGIN ===== */}
        <Route
          path="/login"
          element={

            <main>

              <section id="acceso-clientes">

                {formularioLogin}

              </section>

            </main>

          }
        />


        {/* ===== PÁGINA DE RECUPERACIÓN DE CONTRASEÑA ===== */}
        <Route
          path="/recuperar-contrasena"
          element={

            <main>

              <RecuperarContrasena />

            </main>

          }
        />


        {/* ===== PÁGINA DE RESTABLECIMIENTO DE CONTRASEÑA ===== */}
        <Route
          path="/restablecer-contrasena"
          element={

            <main>

              <RestablecerContrasena />

            </main>

          }
        />


        {/* ===== PÁGINA PRINCIPAL ===== */}
        <Route
          path="/"
          element={

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

          }
        />


        {/* ===== PÁGINA INDEPENDIENTE DE SERVICIOS ===== */}
        <Route
          path="/servicios"
          element={

            <main>

              <Servicios />

            </main>

          }
        />


        {/* ===== PÁGINA INDEPENDIENTE DE NUESTRO EQUIPO ===== */}
        <Route
          path="/equipo"
          element={

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

          }
        />


        {/* ===== PÁGINA INDEPENDIENTE DE TRABAJOS ===== */}
        <Route
          path="/trabajos"
          element={<Trabajos />}
        />


        {/* ===== PÁGINA INDEPENDIENTE DE CONTACTO ===== */}
        <Route
          path="/contacto"
          element={<Contacto />}
        />


        {/* ===== PERFIL INDIVIDUAL DEL ARTISTA ===== */}
        <Route
          path="/artistas/:id"
          element={

            cargando ? (

              <p>Cargando perfil del artista...</p>

            ) : (

              <main>

                {/* ===== INFORMACIÓN Y RESERVAS DEL ARTISTA ===== */}
                <PerfilArtista
                  artistas={artistas}
                  token={token}
                  usuario={usuario}
                />

              </main>

            )

          }
        />


        {/* ===== RUTAS NO ENCONTRADAS ===== */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </div>

  );

}


// ===== EXPORTAR COMPONENTE PRINCIPAL =====
export default App;