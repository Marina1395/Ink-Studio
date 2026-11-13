
/*========== PÁGINA DE REGISTRO DE CLIENTES ==========*/



/*----Guardamos el nombre introducido por el cliente----*/
const [nombre, setNombre] = useState("");


function Registro() {



    /*----Mostramos el formulario de registro de Hache Studio----*/
    return (

        <div className="registro-usuario">

            {/*----Título de la página de registro----*/}
            <h2>Crear cuenta</h2>

            {/*----Información para los nuevos clientes----*/}
            <p>
                Regístrate en Hache Studio para
                reservar tus citas de tatuaje o piercing.
            </p>




            {/*----Formulario para registrar nuevos clientes----*/}
            <form>


                {/*----Campo para introducir el nombre----*/}
                <label htmlFor="nombre-registro">

                    Nombre:

                </label>

                <input

                    id="nombre-registro"
                    type="text"
                    name="nombre"
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    autoComplete="given-name"
                    required

                />

                

                {/*----Campo para introducir los apellidos----*/}

                <label htmlFor="apellidos-registro">

                    Apellidos:
                </label>

                <input

                    id="apellidos-registro"
                    type="text"
                    name="apellidos"
                    autoComplete="family-name"
                    required

                />

                {/*----Campo para introducir el correo electrónico----*/}
                <label htmlFor="email-registro">

                    Correo electrónico:

                </label>

                <input

                    id="email-registro"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                />


                {/*----Campo para introducir la contraseña----*/}

                <label htmlFor="contrasena-registro">

                    Contraseña:

                </label>

                <input

                    id="contrasena-registro"
                    type="password"
                    name="contrasena"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    
                />


                {/*----Campo para introducir el teléfono----*/}

                <label htmlFor="telefono-registro">

                    Teléfono:

                </label>

                <input

                    id="telefono-registro"
                    type="tel"
                    name="telefono"
                    autoComplete="tel"
                    required

                />



                {/*----Campo opcional para introducir la dirección----*/}
                <label htmlFor="direccion-registro">

                    Dirección (opcional):

                </label>

                <input

                    id="direccion-registro"
                    type="text"
                    name="direccion"
                    autoComplete="street-address"

                />




                {/*----Botón para enviar el formulario----*/}
                <button type="button">

                    Crear cuenta

                </button>

            </form>

        </div>

    );

}

/*----Exportamos el componente para utilizarlo en App.jsx----*/
export default Registro;
