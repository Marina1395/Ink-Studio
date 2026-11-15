--
-- PostgreSQL database dump
--

\restrict 5aCIyZf9FH3XBxB57N87c0NDjR4tavekNvwje4fWN1modiu7OVbRGNO7Yc22IAW

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-11-15 15:11:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 41179)
-- Name: artista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artista (
    id_usuario integer CONSTRAINT "ARTISTA_id_usuario_not_null" NOT NULL,
    especialidad character varying(100),
    descripcion character varying,
    imagen character varying(255),
    imagen_tarjeta character varying(255),
    descripcion_larga text
);


ALTER TABLE public.artista OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 41185)
-- Name: artista_servicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artista_servicio (
    id_artista integer NOT NULL,
    id_servicio integer NOT NULL
);


ALTER TABLE public.artista_servicio OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41190)
-- Name: cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cita (
    id_cita integer CONSTRAINT "CITA_id_cita_not_null" NOT NULL,
    id_cliente integer CONSTRAINT "CITA_id_cliente_not_null" NOT NULL,
    id_artista integer CONSTRAINT "CITA_id_artista_not_null" NOT NULL,
    id_servicio integer CONSTRAINT "CITA_id_servicio_not_null" NOT NULL,
    fecha date CONSTRAINT "CITA_fecha_not_null" NOT NULL,
    hora time without time zone CONSTRAINT "CITA_hora_not_null" NOT NULL,
    estado character varying CONSTRAINT "CITA_estado_not_null" NOT NULL,
    duracion_minutos integer,
    CONSTRAINT cita_duracion_minutos_check CHECK ((duracion_minutos > 0))
);


ALTER TABLE public.cita OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 41203)
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cita ALTER COLUMN id_cita ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cita_id_cita_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 41204)
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 41205)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_cliente integer DEFAULT nextval('public.cliente_id_cliente_seq'::regclass) CONSTRAINT "CLIENTE_id_cliente_not_null" NOT NULL,
    nombre character varying(100) CONSTRAINT "CLIENTE_nombre_not_null" NOT NULL,
    apellidos character varying(150) CONSTRAINT "CLIENTE_apellidos_not_null" NOT NULL,
    telefono character varying(20),
    direccion character varying(255),
    id_usuario integer CONSTRAINT "CLIENTE_id_usuario_not_null" NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41215)
-- Name: mensaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensaje (
    id_mensaje integer CONSTRAINT "MENSAJE_id_mensaje_not_null" NOT NULL,
    nombre character varying(100),
    email character varying(150),
    asunto character varying(150),
    mensaje text
);


ALTER TABLE public.mensaje OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 41221)
-- Name: mensaje_id_mensaje_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.mensaje ALTER COLUMN id_mensaje ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.mensaje_id_mensaje_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 41222)
-- Name: servicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicio (
    id_servicio integer CONSTRAINT "SERVICIO_id_servicio_not_null" NOT NULL,
    nombre character varying(100) CONSTRAINT "SERVICIO_nombre_not_null" NOT NULL,
    descripcion text,
    precio numeric(10,2) CONSTRAINT "SERVICIO_precio_not_null" NOT NULL
);


ALTER TABLE public.servicio OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 41230)
-- Name: servicio_id_servicio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.servicio ALTER COLUMN id_servicio ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.servicio_id_servicio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 41231)
-- Name: trabajo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trabajo (
    id_trabajo integer CONSTRAINT "TRABAJO_id_trabajo_not_null" NOT NULL,
    id_artista integer,
    titulo character varying(150),
    descripcion text,
    imagen character varying(255)
);


ALTER TABLE public.trabajo OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 41237)
-- Name: trabajo_id_trabajo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.trabajo ALTER COLUMN id_trabajo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.trabajo_id_trabajo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 41238)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer CONSTRAINT "USUARIO_id_usuario_not_null" NOT NULL,
    nombre character varying(100) CONSTRAINT "USUARIO_nombre_not_null" NOT NULL,
    email character varying(150) CONSTRAINT "USUARIO_email_not_null" NOT NULL,
    contrasena character varying(225) CONSTRAINT "USUARIO_contrasena_not_null" NOT NULL,
    rol character varying(20) CONSTRAINT "USUARIO_rol_not_null" NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 41246)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 4890 (class 2604 OID 41247)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 5066 (class 0 OID 41179)
-- Dependencies: 219
-- Data for Name: artista; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artista (id_usuario, especialidad, descripcion, imagen, imagen_tarjeta, descripcion_larga) FROM stdin;
21	Piercing	Body piercer y modificadora corporal, especializada en perforaciones, bioseguridad y asesoramiento personalizado. Apasionada por su profesión y comprometida con la formación continua.	/artistas/fanny.jpg	/artistas/fanny-tarjeta.png	Fanny, conocida en redes como La Fox Fem, es una apasionada del body piercing y la modificación corporal. Comenzó en el mundo del tatuaje y en 2022 decidió dar el salto a las perforaciones corporales.\n\nDesde entonces, no ha dejado de formarse en diferentes técnicas de perforación, anatomía, bioseguridad, esterilización, joyería corporal y primeros auxilios. Para ella, siempre hay algo nuevo que aprender.\n\nLe encanta enfrentarse a nuevos retos, asesorar a sus clientes y acompañarlos durante todo el proceso. Su prioridad es que cada persona se sienta cómoda, segura y feliz con su nuevo piercing.
\.


--
-- TOC entry 5067 (class 0 OID 41185)
-- Dependencies: 220
-- Data for Name: artista_servicio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artista_servicio (id_artista, id_servicio) FROM stdin;
21	5
\.


--
-- TOC entry 5068 (class 0 OID 41190)
-- Dependencies: 221
-- Data for Name: cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita (id_cita, id_cliente, id_artista, id_servicio, fecha, hora, estado, duracion_minutos) FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 41205)
-- Dependencies: 224
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id_cliente, nombre, apellidos, telefono, direccion, id_usuario) FROM stdin;
5	Cliente	Prueba	NULL	NULL	13
9	Laura	Garcia Lopez	600123456	Calle Prueba 15, Madrid	26
\.


--
-- TOC entry 5072 (class 0 OID 41215)
-- Dependencies: 225
-- Data for Name: mensaje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mensaje (id_mensaje, nombre, email, asunto, mensaje) FROM stdin;
\.


--
-- TOC entry 5074 (class 0 OID 41222)
-- Dependencies: 227
-- Data for Name: servicio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicio (id_servicio, nombre, descripcion, precio) FROM stdin;
3	Tatuaje	Sesión de tatuaje	100.00
5	Piercing	Perforación corporal. Precio orientativo desde 25 euros. Los detalles y el precio final se concretarán con el profesional.	25.00
\.


--
-- TOC entry 5076 (class 0 OID 41231)
-- Dependencies: 229
-- Data for Name: trabajo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trabajo (id_trabajo, id_artista, titulo, descripcion, imagen) FROM stdin;
\.


--
-- TOC entry 5078 (class 0 OID 41238)
-- Dependencies: 231
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre, email, contrasena, rol) FROM stdin;
21	Fanny	fanny.demo@example.com	$2b$10$PuqSWmuJzV8gjVHdc5ygGuZ1w4hoCw7.2nA5UazYJ73hUaUaHlfFy	artista
13	Cliente Prueba	clienteprueba@inkstudio.com	$2b$10$NEIW9i/ZK4BO.Yhgm4Yi4uAyL6wFlilA0EDLrBnIlY4gV7CLbE2WG	cliente
26	Laura	laura.prueba.hache@example.com	$2b$10$eRYR.MKoMHskmUszcvjKpOca1DP8qdQMsYhZ8RxBsSaVpJU4IvjuS	cliente
\.


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 222
-- Name: cita_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_id_cita_seq', 1, false);


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 223
-- Name: cliente_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 9, true);


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 226
-- Name: mensaje_id_mensaje_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mensaje_id_mensaje_seq', 1, false);


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 228
-- Name: servicio_id_servicio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicio_id_servicio_seq', 5, true);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 230
-- Name: trabajo_id_trabajo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trabajo_id_trabajo_seq', 1, false);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 26, true);


--
-- TOC entry 4895 (class 2606 OID 41249)
-- Name: artista_servicio artista_servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artista_servicio
    ADD CONSTRAINT artista_servicio_pkey PRIMARY KEY (id_artista, id_servicio);


--
-- TOC entry 4893 (class 2606 OID 41251)
-- Name: artista pk_artista; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artista
    ADD CONSTRAINT pk_artista PRIMARY KEY (id_usuario);


--
-- TOC entry 4897 (class 2606 OID 41253)
-- Name: cita pk_cita; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT pk_cita PRIMARY KEY (id_cita);


--
-- TOC entry 4899 (class 2606 OID 41255)
-- Name: cliente pk_cliente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT pk_cliente PRIMARY KEY (id_cliente);


--
-- TOC entry 4903 (class 2606 OID 41257)
-- Name: mensaje pk_mensaje; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT pk_mensaje PRIMARY KEY (id_mensaje);


--
-- TOC entry 4905 (class 2606 OID 41259)
-- Name: servicio pk_servicio; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT pk_servicio PRIMARY KEY (id_servicio);


--
-- TOC entry 4907 (class 2606 OID 41261)
-- Name: trabajo pk_trabajo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trabajo
    ADD CONSTRAINT pk_trabajo PRIMARY KEY (id_trabajo);


--
-- TOC entry 4909 (class 2606 OID 41263)
-- Name: usuario pk_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT pk_usuario PRIMARY KEY (id_usuario);


--
-- TOC entry 4901 (class 2606 OID 41265)
-- Name: cliente uq_cliente_id_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT uq_cliente_id_usuario UNIQUE (id_usuario);


--
-- TOC entry 4911 (class 2606 OID 41266)
-- Name: artista_servicio artista_servicio_id_artista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artista_servicio
    ADD CONSTRAINT artista_servicio_id_artista_fkey FOREIGN KEY (id_artista) REFERENCES public.artista(id_usuario);


--
-- TOC entry 4912 (class 2606 OID 41271)
-- Name: artista_servicio artista_servicio_id_servicio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artista_servicio
    ADD CONSTRAINT artista_servicio_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio);


--
-- TOC entry 4910 (class 2606 OID 41276)
-- Name: artista fk_artista_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artista
    ADD CONSTRAINT fk_artista_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) NOT VALID;


--
-- TOC entry 4913 (class 2606 OID 41281)
-- Name: cita fk_cita_artista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_artista FOREIGN KEY (id_artista) REFERENCES public.artista(id_usuario) NOT VALID;


--
-- TOC entry 4914 (class 2606 OID 41286)
-- Name: cita fk_cita_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 4916 (class 2606 OID 41291)
-- Name: cliente fk_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) NOT VALID;


--
-- TOC entry 4918 (class 2606 OID 41296)
-- Name: usuario fk_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) NOT VALID;


--
-- TOC entry 4917 (class 2606 OID 41301)
-- Name: trabajo fk_trabajo_artista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trabajo
    ADD CONSTRAINT fk_trabajo_artista FOREIGN KEY (id_artista) REFERENCES public.artista(id_usuario) NOT VALID;


--
-- TOC entry 4915 (class 2606 OID 41306)
-- Name: cita kf_cita_servicio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT kf_cita_servicio FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) NOT VALID;


-- Completed on 2026-11-15 15:11:58

--
-- PostgreSQL database dump complete
--

\unrestrict 5aCIyZf9FH3XBxB57N87c0NDjR4tavekNvwje4fWN1modiu7OVbRGNO7Yc22IAW

