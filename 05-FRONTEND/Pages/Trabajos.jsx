import { useEffect, useState } from "react";

function Trabajos() {

  // ESTADOS DE LA GALERÍA

  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // OBTENER LOS TRABAJOS DEL BACKEND

  useEffect(() => {

    const obtenerTrabajos = async () => {

      try {

        const respuesta = await fetch(
          "http://localhost:3000/trabajos"
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los trabajos");
        }

        const datos = await respuesta.json();

        // Mostrar únicamente trabajos con artista e imagen

        const trabajosValidos = datos.filter(
          (trabajo) => trabajo.id_artista && trabajo.imagen
        );

        setTrabajos(trabajosValidos);

      } catch (error) {

        setError(error.message);

      } finally {

        setCargando(false);

      }

    };

    obtenerTrabajos();

  }, []);

  // ESTADO DE CARGA

  if (cargando) {
    return <p>Cargando trabajos...</p>;
  }

  // CONTROL DE ERRORES

  if (error) {
    return <p>{error}</p>;
  }

  // MOSTRAR LA GALERÍA

  return (

    <main className="pagina-trabajos">

      <h1>Nuestros trabajos</h1>

      <p>Descubre los trabajos realizados por nuestros artistas.</p>

      {trabajos.length === 0 ? (

        <p>No hay trabajos disponibles.</p>

      ) : (

        <div className="galeria-trabajos">

          {trabajos.map((trabajo) => (

            <article
              key={trabajo.id_trabajo}
              className="tarjeta-trabajo"
            >

              <img
                src={trabajo.imagen}
                alt={trabajo.titulo || "Trabajo de Hache Studio"}
                loading="lazy"
              />

              <h2>{trabajo.titulo}</h2>

              <p>{trabajo.descripcion}</p>

            </article>

          ))}

        </div>

      )}

    </main>

  );

}

export default Trabajos;