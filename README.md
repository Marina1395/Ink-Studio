# Hache Studio

## Descripción del proyecto

Hache Studio es una aplicación web desarrollada como Trabajo de Fin de Grado del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW).

El proyecto representa un estudio especializado en tatuajes, piercings y gemas dentales.

La aplicación integra un frontend desarrollado con React, una API REST construida con Node.js y Express y una base de datos PostgreSQL.

Su objetivo es permitir a los usuarios consultar servicios y profesionales, registrarse, iniciar sesión y gestionar solicitudes de citas.

**Estado actual:** versión avanzada del proyecto, preparada para la entrega del 85 % prevista para el 15 de noviembre de 2026.

**Entrega definitiva prevista:** 29 de noviembre de 2026.

---

## 1. Tecnologías utilizadas

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
- JWT
- bcrypt
- CORS
- dotenv

### Base de datos
- PostgreSQL 18
- pgAdmin 4
- psql

### Herramientas
- Visual Studio Code
- Postman
- Git y GitHub

---

## 2. Funcionalidades implementadas

### Interfaz web

- Página principal de presentación del estudio.
- Información sobre tatuajes, piercings y gemas dentales.
- Listado de profesionales obtenido desde la API.
- Filtrado de profesionales por especialidad.
- Consulta de perfiles individuales.
- Visualización de servicios.
- Registro de clientes.
- Inicio y cierre de sesión.
- Navegación condicionada por el rol del usuario.

### Gestión de citas del cliente

- Consulta de artistas y servicios.
- Selección de fecha y horario disponible.
- Solicitud de citas mediante una cuenta autenticada.
- Consulta de citas desde el apartado «Mis citas».
- Visualización del estado de cada solicitud.
- Consulta de los cambios realizados por el artista.

### Gestión de citas del artista

- Acceso al panel «Gestión de citas».
- Consulta de las solicitudes asignadas al artista.
- Selección de la duración estimada.
- Confirmación de solicitudes pendientes.
- Rechazo de solicitudes pendientes.
- Actualización del estado de las citas en PostgreSQL.

Los estados utilizados actualmente son:

- `pendiente`: solicitud todavía sin resolver.
- `confirmada`: cita aceptada por el artista.
- `cancelada`: cita cancelada o solicitud rechazada.

### API REST

- Gestión de usuarios.
- Autenticación mediante JWT.
- Protección de contraseñas con bcrypt.
- Control de acceso mediante roles.
- Gestión de clientes y artistas.
- Gestión de servicios y trabajos.
- Gestión de las relaciones entre artistas y servicios.
- Creación, consulta, actualización y eliminación de citas según los permisos establecidos.
- Consulta de disponibilidad.
- Validación de fechas y horarios.
- Control de duración de las citas.
- Prevención de solapamientos entre citas confirmadas.
- Gestión de mensajes mediante la API.

Algunas operaciones administrativas todavía no disponen de una interfaz gráfica específica.

---

## 3. Estructura del proyecto

```text
INKSTUDIO/
│
├── 03-BASE DE DATOS/
│   ├── ink_studio.sql
│   └── HACHE_STUDIO_ENTREGA_JOSE_MANUEL_15_NOV_2026.sql
│
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
│
├── 05-FRONTEND/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## 4. Requisitos previos

Para ejecutar el proyecto es necesario disponer de:

- Node.js y npm compatibles con las dependencias.
- PostgreSQL 18.
- psql para importar la base de datos.
- Un editor de código.

Se recomienda utilizar pgAdmin 4 para consultar y administrar la base de datos.

---

## 5. Instalación y configuración

### 5.1. Preparar PostgreSQL

Crear una base de datos nueva llamada:

```text
inkstudio
```

Para inicializar el proyecto con los datos de demostración, utilizar el archivo:

```text
03-BASE DE DATOS/HACHE_STUDIO_ENTREGA_JOSE_MANUEL_15_NOV_2026.sql
```

Desde la carpeta principal del proyecto, ejecutar:

```bash
psql -U postgres -d inkstudio -f "03-BASE DE DATOS/HACHE_STUDIO_ENTREGA_JOSE_MANUEL_15_NOV_2026.sql"
```

Este archivo incluye la estructura de la base de datos y los registros de demostración preparados para la entrega.

La base de datos contiene ocho tablas:

1. `usuario`
2. `cliente`
3. `artista`
4. `artista_servicio`
5. `servicio`
6. `trabajo`
7. `cita`
8. `mensaje`

También incluye claves primarias, claves foráneas, relaciones y secuencias necesarias para generar nuevos identificadores.

**Importante:** la importación debe realizarse sobre una base de datos nueva y vacía. No se debe utilizar para sobrescribir una base de datos que ya contenga información.

El archivo `ink_studio.sql` se conserva como referencia de la estructura de la primera entrega.

### 5.2. Configurar el backend

Acceder a la carpeta:

```bash
cd 04-BACKEND
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` a partir de `.env.example`.

Configurar las variables necesarias:

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

El archivo `.env` contiene información privada y no debe publicarse en GitHub.

Iniciar el backend:

```bash
npm start
```

Dirección de la API:

```text
http://localhost:3000
```

### 5.3. Configurar el frontend

Desde otra terminal, acceder a:

```bash
cd 05-FRONTEND
```

Instalar las dependencias:

```bash
npm install
```

Iniciar React:

```bash
npm run dev
```

Dirección habitual de Vite:

```text
http://localhost:5173
```

El frontend realiza peticiones al backend mediante:

```text
http://localhost:3000
```

Ambos servidores deben estar ejecutándose para utilizar las funcionalidades conectadas con PostgreSQL.

### 5.4. Comprobar la compilación

Desde la carpeta `05-FRONTEND`:

```bash
npm run build
```

Este comando genera la carpeta `dist`.

La compilación se ha comprobado correctamente el 15 de noviembre de 2026 utilizando Vite.

---

## 6. Autenticación y permisos

La aplicación utiliza JWT para autenticar usuarios.

Las contraseñas se almacenan mediante hashes generados con bcrypt.

Se contemplan tres roles:

### Administrador

Puede realizar las operaciones administrativas autorizadas por la API.

### Artista

Puede consultar y gestionar las solicitudes de citas que le corresponden.

### Cliente

Puede solicitar citas y consultar sus reservas.

Las rutas protegidas requieren enviar el token:

```text
Authorization: Bearer TOKEN
```

El token se obtiene al iniciar sesión.

Cuando caduca, es necesario volver a autenticarse.

---

## 7. Datos de demostración

Para facilitar la revisión del proyecto se ha preparado una base de datos independiente con registros de demostración.

La base incluye:

- **Fanny:** cuenta de artista.
- **Laura:** cuenta de cliente.
- **Cliente Prueba:** segunda cuenta de cliente.
- Dos servicios: tatuaje y piercing.
- La relación entre Fanny y el servicio de piercing.

Las cuentas de demostración conservan sus contraseñas almacenadas mediante hashes bcrypt.

Las credenciales necesarias para iniciar sesión se facilitarán por separado para la revisión.

Los datos se han incorporado en una base de demostración independiente, sin modificar la base de datos original utilizada durante el desarrollo.

---

## 8. Funcionamiento de las citas

El proceso principal de reservas funciona de la siguiente manera:

1. El cliente inicia sesión.
2. Consulta los servicios y profesionales.
3. Selecciona un artista.
4. Escoge una fecha y un horario disponible.
5. Envía una solicitud.
6. La cita se registra inicialmente como `pendiente`.
7. El artista inicia sesión.
8. Accede a su panel de gestión.
9. Puede confirmar o rechazar la solicitud.
10. Si confirma, establece la duración estimada.
11. PostgreSQL guarda el estado actualizado.
12. El cliente consulta el resultado desde «Mis citas».

### Disponibilidad

La aplicación consulta los horarios disponibles según las reservas existentes.

El backend comprueba las restricciones horarias y evita que se confirmen citas solapadas.

La duración de una cita confirmada se utiliza para determinar el intervalo ocupado.

---

## 9. Endpoints principales

| Ruta | Funcionalidad |
|---|---|
| `/usuarios` | Gestión de usuarios |
| `/usuarios/login` | Autenticación |
| `/clientes` | Gestión de clientes |
| `/artistas` | Gestión de profesionales |
| `/trabajos` | Gestión de trabajos |
| `/servicios` | Gestión de servicios |
| `/citas` | Gestión de citas |
| `/citas/disponibilidad` | Consulta de disponibilidad |
| `/mensajes` | Gestión de mensajes |

Los métodos HTTP y permisos disponibles dependen de cada operación y de la configuración de las rutas del backend.

---

## 10. Pruebas realizadas

Durante el desarrollo se han utilizado React, Postman y pgAdmin para comprobar la comunicación entre frontend, backend y PostgreSQL.

### Pruebas de autenticación

- Inicio de sesión.
- Generación de tokens JWT.
- Restricciones según el rol.
- Acceso a las pantallas correspondientes.

### Pruebas de citas

- Creación de solicitudes.
- Consulta de citas del cliente.
- Consulta de citas del artista.
- Confirmación de solicitudes.
- Rechazo de solicitudes.
- Actualización de estados.
- Persistencia de cambios en PostgreSQL.
- Comprobación de horarios disponibles.
- Validación de duración.
- Comprobación de citas consecutivas.
- Prevención de solapamientos.

### Pruebas de interfaz

- Navegación entre las páginas principales.
- Consulta de servicios.
- Visualización de profesionales.
- Acceso a perfiles individuales.
- Revisión básica de la consola del navegador.

### Pruebas técnicas

- Arranque del servidor Express.
- Conexión funcional con PostgreSQL.
- Compilación del frontend con Vite.
- Revisión de los archivos registrados en Git.
- Comprobación de que el archivo `.env` real no está registrado en Git.
- Restauración de la base de datos en una base independiente.
- Importación y comprobación de los datos de demostración.
- Comprobación de las relaciones entre usuarios, clientes, artistas y servicios.
- Sincronización de las secuencias automáticas de identificadores.

La compilación del frontend se ha comprobado correctamente el 15 de noviembre de 2026.

La restauración de la base de datos y la carga de los datos de demostración también se han comprobado localmente.

La instalación completa desde cero en otro ordenador todavía está pendiente de verificar.

---

## 11. Estado actual del proyecto

Hache Studio se encuentra en una fase avanzada de desarrollo.

La arquitectura principal está implementada y se ha comprobado el funcionamiento de los procesos fundamentales de autenticación, consulta de profesionales y gestión de citas.

Esta versión corresponde a la **entrega del 85 % del proyecto, prevista para el 15 de noviembre de 2026**.

El porcentaje representa una estimación del avance general del proyecto.

### Funcionalidades verificadas

- Autenticación y control de roles.
- Consulta de servicios.
- Consulta de perfiles de profesionales existentes.
- Solicitud de citas.
- Gestión de citas por el artista.
- Aceptación y rechazo de solicitudes.
- Consulta de estados por el cliente.
- Disponibilidad de horarios.
- Comunicación entre React, Express y PostgreSQL.
- Preparación de una base de datos independiente con datos de demostración.

### Aspectos pendientes

- Completar la incorporación de los profesionales previstos.
- Revisar y limpiar los registros de prueba de la base original.
- Completar la galería dinámica de trabajos.
- Implementar notificaciones internas para los clientes.
- Incorporar interfaces gráficas para determinadas operaciones administrativas.
- Completar las pruebas de endpoints pendientes.
- Realizar ajustes visuales y responsive.
- Verificar la instalación completa en un entorno externo.
- Finalizar la documentación del proyecto.

Estas tareas se abordarán antes de la entrega definitiva del 29 de noviembre de 2026, según su prioridad.

---

## 12. Seguridad

- Las contraseñas se protegen mediante bcrypt.
- La autenticación utiliza JWT.
- Las operaciones protegidas requieren permisos adecuados.
- El archivo `.env` real no debe incluirse en el repositorio.
- Las contraseñas de PostgreSQL y las claves JWT deben mantenerse privadas.
- Los datos de demostración deben ser ficticios.
- Los archivos temporales que contengan información sensible no deben publicarse en GitHub.

---

## 13. Autoría

**Marina Martín Hacar**

Trabajo de Fin de Grado del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW).

**Proyecto:** Hache Studio

**Entrega del 85 %:** 15 de noviembre de 2026.

**Entrega definitiva prevista:** 29 de noviembre de 2026.