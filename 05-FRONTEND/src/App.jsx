
import { useState, useEffect } from 'react';
import './App.css';


function App() {


  //=====DATOS DE PRUEBA DE LOS PROFESIONALES====//
  const profesionales = [


    { id: 1, nombre: "Profesional 1", especialidad: "Tatuajes" },
    { id: 2, nombre: "Profesional 2", especialidad: "Piercings" },
    { id: 3, nombre: "Profesional 3", especialidad: "Gemas dentales" },
    { id: 4, nombre: "Profesional 4", especialidad: "Tatuajes y piercings" },
    { id: 5, nombre: "Profesional 5", especialidad: "Piercings y gemas dentales" },
    { id: 6, nombre: "Profesional 6", especialidad: "Tatuajes" },

  ];

  /*Guardamos la especialidad seleccionada*/
  const [filtro, setFiltro] = useState("Todos");




  /*Guardamos los artistas que recibiremos del backend*/
  const [artistas, setArtistas] = useState([]);


  /*Obtener artistas desde el backend*/
  useEffect(() => {

    const obtenerArtistas = async () => {

      try{


        /*Hacemos peticion al backend*/
        const respuesta  = await fetch("http://localhost:3000/artistas");



        /*Comprobaremos que la petición haya sido correcta */

        if(!respuesta.ok){

          throw new Error("Error al obtener los artistas");
 
        }


        /*Convertimos la respuesta JSON  a datos de JavaScript */
        const datos = await respuesta.json();


        /* Guardamos los artistas recibidos */
        setArtistas(datos);


        /*Comprobamos qué artistas hemos recibido */
        console.log("Artistas recibidos del backend:",datos)


      }catch(error){

        console.error("Error al cargar los artistas: ", error);

      }

    };

    obtenerArtistas();



  },[]);



  // Filtramos los profesionales según la especialidad//CONTINUAS EL VIERNES AQUI
  const profesionalesFiltrados = profesionales.filter((profesional) => {

    return filtro === "Todos" ||

      profesional.especialidad.includes(filtro);

  });






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


      {/*=====SECCIÓN DE PROFESIONALES=====*/}
      <section id="equipo">

        <h2>Conoce a nuestro equipo</h2>



        {/*=====BOTONES PARA FILTRAR PROFESIONALES====*/}
        <div className="filtros-equipo">


          <button onClick = {() => setFiltro("Todos")}>

            Todos

          </button>


          <button onClick = {() => setFiltro("Tatuajes")}>

            Tatuajes

          </button>


          <button onClick={()=> setFiltro("Piercings")}>

            Piercings

          </button>


          <button onClick = {()=> setFiltro("Gemas dentales")}>

            Gemas dentales

          </button>


        </div>




        <div className="equipo-container">

          {profesionalesFiltrados.map((profesional) => (


            <div className="profesional" key={profesional.id}>

              <h3>{profesional.nombre}</h3>

              <p>{profesional.especialidad}</p>

              <button>Ver perfil</button>

            </div>



          ))}

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