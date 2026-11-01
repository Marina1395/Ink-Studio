
# Hache Studio

## Descripción del proyecto

Hache Studio es una aplicación web desarrollada como proyecto final del Grado Superior en Desarrollo de Aplicaciones Web (DAW).

El proyecto representa un estudio especializado en tatuajes, piercings y gemas dentales.

La aplicación combina una interfaz desarrollada con React, una API REST construida con Node.js y Express y una base de datos PostgreSQL.

Su objetivo es permitir la consulta de artistas y servicios, la autenticación de usuarios y la gestión de solicitudes de citas.

Esta versión corresponde a una entrega parcial del proyecto, con las funcionalidades principales desarrolladas y otras pendientes de completar.

## Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript
- React 19
- React Router
- Vite

### Backend

- Node.js
- Express 5
- JWT (JSON Web Tokens)
- bcrypt
- CORS
- dotenv

### Base de datos

- PostgreSQL
- pgAdmin 4
- psql

### Herramientas de desarrollo

- Visual Studio Code
- Postman
- Git y GitHub

## Funcionalidades implementadas

### Interfaz web

- Página principal de presentación del estudio.
- Información sobre tatuajes, piercings y gemas dentales.
- Listado de artistas obtenido desde la API.
- Filtrado de artistas por especialidad.
- Consulta de perfiles individuales.
- Inicio y cierre de sesión.
- Consulta de servicios y horarios disponibles.
- Solicitud de citas por usuarios autenticados con rol de cliente.

### API REST

- Gestión de usuarios.
- Autenticación mediante JWT.
- Contraseñas protegidas mediante bcrypt.
- Control de acceso mediante roles.
- Gestión de clientes y artistas.
- Gestión de trabajos y servicios.
- Creación, consulta, actualización y eliminación de citas según los permisos establecidos.
- Comprobación de disponibilidad y prevención de solapamientos de citas confirmadas.
- Gestión de mensajes.

Algunas funcionalidades administrativas están disponibles a través de la API y todavía no cuentan con una interfaz gráfica específica.

## Estructura del proyecto

```text
INKSTUDIO/
├── 03-BASE DE DATOS/
│   └── ink_studio.sql
├── 04-BACKEND/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── 05-FRONTEND/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto es necesario disponer de:

- Node.js y npm compatibles con las dependencias instaladas.
- PostgreSQL.
- psql, incluido en las instalaciones habituales de PostgreSQL.
- Un editor de código, como Visual Studio Code.

pgAdmin 4 es opcional, pero facilita la creación de la base de datos y la consulta de sus tablas.

## Instalación y configuración

### 1. Preparar la base de datos

Crear en PostgreSQL una base de datos llamada:

```text
inkstudio
```

El archivo `03-BASE DE DATOS/ink_studio.sql` contiene la estructura de las siete tablas del proyecto, incluidas sus claves, relaciones y secuencias.

Para importar la estructura se recomienda utilizar `psql`, ya que la exportación contiene instrucciones específicas de esta herramienta.

Desde una terminal situada en la carpeta principal `INKSTUDIO`, ejecutar:

```bash
psql -U postgres -d inkstudio -f "03-BASE DE DATOS/ink_studio.sql"
```

Cuando corresponda, PostgreSQL solicitará la contraseña del usuario.

Si `psql` no se reconoce como comando, deberá ejecutarse desde la carpeta de herramientas de PostgreSQL o añadirse a la variable PATH del sistema.

La exportación incluye únicamente la estructura de la base de datos, no los registros de prueba.

### 2. Configurar el backend

Desde la carpeta principal del proyecto, acceder al backend:

```bash
cd 04-BACKEND
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` a partir de `.env.example` y configurar los datos de conexión:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inkstudio
DB_USER=postgres
DB_PASSWORD=tu_contrasena

JWT_SECRET=tu_clave_secreta_larga_y_aleatoria
PORT=3000
```

Los valores deben adaptarse a la configuración local de PostgreSQL.

`JWT_SECRET` debe contener una clave larga, aleatoria y privada para firmar los tokens de autenticación.

El archivo `.env` contiene información privada y no debe publicarse en el repositorio.

Iniciar el servidor:

```bash
npm start
```

Por defecto, la API estará disponible en:

http://localhost:3000

### 3. Configurar el frontend

Abrir otra terminal y, desde la carpeta principal del proyecto, acceder a:

```bash
cd 05-FRONTEND
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Con la configuración habitual de Vite, la aplicación estará disponible en:

http://localhost:5173

El frontend está configurado para realizar peticiones a:

http://localhost:3000

Para utilizar las funcionalidades conectadas con PostgreSQL, el backend y el frontend deben estar ejecutándose.

### 4. Comprobar la compilación del frontend

Para comprobar que el frontend puede generar una versión de producción, ejecutar desde `05-FRONTEND`:

```bash
npm run build
```

Este comando genera la carpeta `dist`.

La compilación se ha comprobado correctamente durante la preparación de esta entrega parcial.

## Datos iniciales para las pruebas

La base de datos se entrega sin registros de demostración ni información personal.

Una vez importada la estructura, es posible registrar usuarios con rol de cliente mediante la aplicación.

Para probar las reservas es necesario disponer previamente de artistas y servicios registrados.

Las operaciones administrativas requieren un usuario con rol de administrador. La creación inicial de este usuario y la preparación de datos de demostración quedan pendientes de documentar para una instalación nueva.

No se incluyen tokens JWT en la entrega, ya que se generan al iniciar sesión y tienen una duración limitada.

## Endpoints principales

| Ruta | Descripción |
|---|---|
| `/usuarios` | Gestión de usuarios |
| `/usuarios/login` | Autenticación |
| `/clientes` | Gestión de clientes |
| `/artistas` | Gestión de artistas |
| `/trabajos` | Gestión de trabajos |
| `/servicios` | Gestión de servicios |
| `/citas` | Gestión de citas |
| `/citas/disponibilidad` | Consulta de horarios disponibles |
| `/mensajes` | Gestión de mensajes |

Los métodos HTTP disponibles y los permisos necesarios dependen de cada operación.

Algunas rutas requieren autenticación y un rol determinado.

## Autenticación y seguridad

La API utiliza JWT para autenticar usuarios.

Los tokens se generan después de validar las credenciales y tienen una duración de una hora.

Las contraseñas se almacenan mediante hashes generados con bcrypt.

La aplicación contempla tres roles:

- **Administrador:** operaciones de administración autorizadas.
- **Artista:** operaciones relacionadas con la gestión de citas según sus permisos.
- **Cliente:** acceso a sus citas y solicitud de nuevas reservas.

Las rutas protegidas requieren enviar el token mediante la cabecera:

```text
Authorization: Bearer TOKEN
```

El token debe sustituirse por el generado al iniciar sesión.

Cuando un token caduca, es necesario volver a iniciar sesión para obtener uno nuevo.

## Funcionamiento de las citas

El cliente puede consultar los horarios disponibles de un artista y solicitar una cita.

La solicitud se registra inicialmente como pendiente.

El artista puede confirmar la cita y establecer su duración.

El backend comprueba las restricciones horarias y evita solapamientos con citas confirmadas.

La disponibilidad depende de los artistas, servicios y citas existentes en la base de datos.

## Pruebas realizadas

Durante el desarrollo se han utilizado Postman y pgAdmin para comprobar el funcionamiento de la API y su comunicación con PostgreSQL.

Se han realizado pruebas de:

- Operaciones CRUD de distintos módulos.
- Inicio de sesión y generación de tokens JWT.
- Restricciones de acceso según el rol.
- Validación de datos.
- Creación y gestión de citas.
- Consulta de disponibilidad.
- Prevención de solapamientos entre citas confirmadas.
- Comunicación entre React, Express y PostgreSQL.

También se ha comprobado el arranque del backend, el funcionamiento del frontend y la compilación de React mediante `npm run build`.

Las operaciones de consulta individual, actualización y eliminación del módulo de mensajes no se han verificado completamente en la revisión final.

## Estado del proyecto

Esta versión corresponde a una **entrega parcial del 50 % del proyecto final de DAW**.

Actualmente se encuentran implementados los módulos principales de la API, la autenticación mediante JWT, la gestión de citas y una interfaz React conectada con el backend.

La aplicación permite consultar artistas, acceder a sus perfiles, iniciar sesión y solicitar citas, siempre que existan los datos necesarios en PostgreSQL.

### Aspectos pendientes

- Completar la galería dinámica de trabajos.
- Incorporar interfaces gráficas para determinadas operaciones administrativas.
- Preparar un procedimiento de inicialización con datos ficticios y un administrador de pruebas.
- Completar las pruebas de los endpoints que todavía no se han verificado.
- Continuar mejorando y ampliando las funcionalidades de la aplicación.

Estos apartados forman parte del desarrollo pendiente para la versión final del proyecto.

## Autoría

**Marina Martín Hacar**

Proyecto final del Grado Superior en Desarrollo de Aplicaciones Web (DAW).
