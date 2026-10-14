
import './App.css';

function App() {

  return (

    <div>


      {/*====CABECERA DE LA WEB====*/}

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


      {/*=====SECCIÓN DE INICIO=====*/}

      <section id="inicio">

        <h2>Bienvenido a Hache Studio</h2>


        <p>

          Estudio de tatuajes,piercings y gemas dentales.
        </p>

        <a href="#servicios">Descubre nuestros servicios</a>



      </section>

      {/*=====SECCIÓN DE SERVICIOS=====*/}

      <section id="servicios">

        <h2>Nuestros servicios</h2>

        <div className="servicios-container">

          <div className="servicio">
            <h3>Tatuajes</h3>
            <p>Diseños personalizados realizados por nuestros artistas.</p>
          </div>

          <div className="servicio">
            <h3>Piercings</h3>
            <p>Perforaciones profesionales adaptadas a tu estilo.</p>
          </div>

          <div className="servicio">
            <h3>Gemas dentales</h3>
            <p>Un toque de brillo para tu sonrisa.</p>
          </div>

        </div>

      </section>



      {/*=====SECCIÓN DE TRABAJOS=====*/}
      <section id="trabajos">

        <h2>Nuestros trabajos</h2>

        <p>Descubre los trabajos realizados por nuestros artistas</p>

      </section>

    </div>


  );


}

export default App;