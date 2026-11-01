--
-- PostgreSQL database dump
--

\restrict jaDiknNFtorTi0dFtYhuhb8U34BHvazZ4KoxPs43m04KcS91GVlLU7qdAZ5rylS

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-11-01 18:26:33

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
-- TOC entry 221 (class 1259 OID 16406)
-- Name: artista; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.artista (
    id_usuario integer CONSTRAINT "ARTISTA_id_usuario_not_null" NOT NULL,
    especialidad character varying(100),
    descripcion character varying
);


--
-- TOC entry 224 (class 1259 OID 16415)
-- Name: cita; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 230 (class 1259 OID 16533)
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- TOC entry 227 (class 1259 OID 16515)
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 220 (class 1259 OID 16403)
-- Name: cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente (
    id_cliente integer DEFAULT nextval('public.cliente_id_cliente_seq'::regclass) CONSTRAINT "CLIENTE_id_cliente_not_null" NOT NULL,
    nombre character varying(100) CONSTRAINT "CLIENTE_nombre_not_null" NOT NULL,
    apellidos character varying(150) CONSTRAINT "CLIENTE_apellidos_not_null" NOT NULL,
    telefono character varying(20),
    direccion character varying(255),
    id_usuario integer CONSTRAINT "CLIENTE_id_usuario_not_null" NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 16418)
-- Name: mensaje; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensaje (
    id_mensaje integer CONSTRAINT "MENSAJE_id_mensaje_not_null" NOT NULL,
    nombre character varying(100),
    email character varying(150),
    asunto character varying(150),
    mensaje text
);


--
-- TOC entry 231 (class 1259 OID 16539)
-- Name: mensaje_id_mensaje_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- TOC entry 223 (class 1259 OID 16412)
-- Name: servicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicio (
    id_servicio integer CONSTRAINT "SERVICIO_id_servicio_not_null" NOT NULL,
    nombre character varying(100) CONSTRAINT "SERVICIO_nombre_not_null" NOT NULL,
    descripcion text,
    precio numeric(10,2) CONSTRAINT "SERVICIO_precio_not_null" NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 16531)
-- Name: servicio_id_servicio_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- TOC entry 222 (class 1259 OID 16409)
-- Name: trabajo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trabajo (
    id_trabajo integer CONSTRAINT "TRABAJO_id_trabajo_not_null" NOT NULL,
    id_artista integer,
    titulo character varying(150),
    descripcion text,
    imagen character varying(255)
);


--
-- TOC entry 229 (class 1259 OID 16532)
-- Name: trabajo_id_trabajo_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- TOC entry 219 (class 1259 OID 16400)
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id_usuario integer CONSTRAINT "USUARIO_id_usuario_not_null" NOT NULL,
    nombre character varying(100) CONSTRAINT "USUARIO_nombre_not_null" NOT NULL,
    email character varying(150) CONSTRAINT "USUARIO_email_not_null" NOT NULL,
    contrasena character varying(225) CONSTRAINT "USUARIO_contrasena_not_null" NOT NULL,
    rol character varying(20) CONSTRAINT "USUARIO_rol_not_null" NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16513)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 226
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 4885 (class 2604 OID 16514)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4893 (class 2606 OID 16448)
-- Name: artista pk_artista; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artista
    ADD CONSTRAINT pk_artista PRIMARY KEY (id_usuario);


--
-- TOC entry 4899 (class 2606 OID 16488)
-- Name: cita pk_cita; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT pk_cita PRIMARY KEY (id_cita);


--
-- TOC entry 4891 (class 2606 OID 16438)
-- Name: cliente pk_cliente; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT pk_cliente PRIMARY KEY (id_cliente);


--
-- TOC entry 4901 (class 2606 OID 16508)
-- Name: mensaje pk_mensaje; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT pk_mensaje PRIMARY KEY (id_mensaje);


--
-- TOC entry 4897 (class 2606 OID 16470)
-- Name: servicio pk_servicio; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT pk_servicio PRIMARY KEY (id_servicio);


--
-- TOC entry 4895 (class 2606 OID 16458)
-- Name: trabajo pk_trabajo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trabajo
    ADD CONSTRAINT pk_trabajo PRIMARY KEY (id_trabajo);


--
-- TOC entry 4889 (class 2606 OID 16431)
-- Name: usuario pk_usuario; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT pk_usuario PRIMARY KEY (id_usuario);


--
-- TOC entry 4904 (class 2606 OID 16449)
-- Name: artista fk_artista_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artista
    ADD CONSTRAINT fk_artista_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) NOT VALID;


--
-- TOC entry 4906 (class 2606 OID 16494)
-- Name: cita fk_cita_artista; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_artista FOREIGN KEY (id_artista) REFERENCES public.artista(id_usuario) NOT VALID;


--
-- TOC entry 4907 (class 2606 OID 16534)
-- Name: cita fk_cita_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 4903 (class 2606 OID 16439)
-- Name: cliente fk_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) NOT VALID;


--
-- TOC entry 4902 (class 2606 OID 16432)
-- Name: usuario fk_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) NOT VALID;


--
-- TOC entry 4905 (class 2606 OID 16459)
-- Name: trabajo fk_trabajo_artista; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trabajo
    ADD CONSTRAINT fk_trabajo_artista FOREIGN KEY (id_artista) REFERENCES public.artista(id_usuario) NOT VALID;


--
-- TOC entry 4908 (class 2606 OID 16499)
-- Name: cita kf_cita_servicio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT kf_cita_servicio FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) NOT VALID;


-- Completed on 2026-11-01 18:26:33

--
-- PostgreSQL database dump complete
--

\unrestrict jaDiknNFtorTi0dFtYhuhb8U34BHvazZ4KoxPs43m04KcS91GVlLU7qdAZ5rylS

