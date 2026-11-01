# Hache Studio

## Descripción del proyecto

Hache Studio es una aplicación web desarrollada como proyecto final del Grado Superior en Desarrollo de Aplicaciones Web (DAW).

El proyecto representa un estudio especializado en tatuajes, piercings y gemas dentales.

La aplicación combina una interfaz desarrollada con React, una API REST construida con Node.js y Express y una base de datos PostgreSQL.

Su objetivo es permitir la consulta de artistas y servicios, la autenticación de usuarios y la gestión de solicitudes de citas.

## Tecnologías utilizadas

**Frontend**
- HTML5
- CSS3
- JavaScript
- React 19
- React Router
- Vite

**Backend**
- Node.js
- Express 5
- JWT (JSON Web Tokens)
- bcrypt
- CORS
- dotenv

**Base de datos**
- PostgreSQL
- pgAdmin 4

**Herramientas de desarrollo**
- Visual Studio Code
- Postman
- Git

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

Algunas funcionalidades administrativas están disponibles a través de la API y no cuentan con una interfaz gráfica específica.

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
- Una herramienta para ejecutar el archivo SQL, como pgAdmin 4.

## Instalación y configuración

### 1. Preparar la base de datos

Crear una base de datos PostgreSQL y ejecutar el archivo:

`03-BASE DE DATOS/ink_studio.sql`

Este archivo contiene la estructura de las siete tablas del proyecto, junto con sus claves y relaciones.

La exportación incluye únicamente la estructura, no los registros de prueba.

### 2. Configurar el backend

Acceder a la carpeta del backend:

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

El archivo `.env` contiene información privada y no debe publicarse en el repositorio.

Iniciar el servidor:

```bash
npm start
```

Por defecto, la API estará disponible en:

`http://localhost:3000`

### 3. Configurar el frontend

Abrir otra terminal y acceder a:

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

`http://localhost:5173`

El frontend está configurado para realizar peticiones a `http://localhost:3000`.

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

Los métodos HTTP y permisos dependen de cada operación.

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

## Funcionamiento de las citas

El cliente puede consultar los horarios disponibles de un artista y solicitar una cita.

La solicitud se registra inicialmente como pendiente.

El artista puede confirmar la cita y establecer su duración.

El backend comprueba las restricciones horarias y evita solapamientos con citas confirmadas.

## Pruebas realizadas

Durante el desarrollo se han utilizado Postman y pgAdmin para comprobar el funcionamiento de la API y su comunicación con PostgreSQL.

Se han realizado pruebas de operaciones CRUD, autenticación, permisos por roles, validación de datos, disponibilidad y prevención de solapamientos.

Las operaciones de consulta, actualización y eliminación del módulo de mensajes no se han verificado completamente en la revisión final.

## Estado del proyecto

Proyecto académico desarrollado para el ciclo formativo de Desarrollo de Aplicaciones Web.

La API incorpora los módulos principales de gestión y la interfaz React permite consultar artistas, iniciar sesión y solicitar citas.

La interfaz de trabajos todavía no muestra una galería dinámica y algunas operaciones de administración se realizan directamente mediante la API.

## Autoría

Proyecto final de Desarrollo de Aplicaciones Web (DAW).

**Marina Martín Hacar**
