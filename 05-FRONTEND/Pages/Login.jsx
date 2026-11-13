/*----Importamos Link para navegar a la página de registro----*/
import { Link } from "react-router-dom";

function Login({
    usuario,
    email,
    setEmail,
    contrasena,
    setContrasena,
    iniciarSesion,
    cerrarSesion,
    iniciandoSesion,
    errorLogin,
    mensajeLogin
}) {

    return (
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


            {/*----Enlace para clientes que todavía no tienen cuenta----*/}
            {!usuario && (

                <p>

                    ¿Todavía no tienes cuenta?{" "}
                    <Link to="/registro">

                        Regístrate

                    </Link>
                    
                </p>
            )}


            {errorLogin && (
                <p role="alert">{errorLogin}</p>
            )}

            {mensajeLogin && (
                <p role="status">{mensajeLogin}</p>
            )}

        </div>
    );
}

export default Login;
