
const citaModel = require("../models/cita.model");

const clienteModel = require("../models/cliente.model");

/*----Importamos el modelo de artistas para comprobar su estado----*/
const artistaModel = require("../models/artista.model");


//=======COMPROBACIONES Y VALIDACIONES========//

/*----Comprobamos que la fecha tenga el formato correcto y exista en nuestro calendario----*/
const validarFecha = (fecha) => {

    if (
        typeof fecha !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {
        return false;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);

    const fechaComprobacion = new Date(
        Date.UTC(anio, mes - 1, dia)
    );

    return (
        fechaComprobacion.getUTCFullYear() === anio &&
        fechaComprobacion.getUTCMonth() === mes - 1 &&
        fechaComprobacion.getUTCDate() === dia
    );

};


/*----Comprobamos que la fecha no esté pasada----*/
const validarFechaNoPasada = (fecha) => {

    const hoy = new Date();

    const partes = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(hoy);

    const obtenerParte = (tipo) =>
        partes.find((parte) => parte.type === tipo).value;

    const fechaHoy =
        `${obtenerParte("year")}-${obtenerParte("month")}-${obtenerParte("day")}`;

    return fecha >= fechaHoy;

};


/*----Comprobamos que la hora esté dentro del horario permitido (13:30-21:30)----*/
const validarHora = (hora) => {

    if (
        typeof hora !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)
    ) {
        return false;
    }

    const [horas, minutos] = hora.split(":").map(Number);

    const minutosTotales = horas * 60 + minutos;

    const apertura = 13 * 60 + 30;
    const cierre = 21 * 60 + 30;

    return (
        minutosTotales >= apertura &&
        minutosTotales < cierre &&
        (minutos === 0 || minutos === 30)
    );

};


/*----Convertimos una hora a minutos----*/
const convertirHoraAMinutos = (hora) => {

    const [horas, minutos] = hora.split(":").map(Number);

    return horas * 60 + minutos;

};


/*----Comprobamos que el ID sea un número entero positivo y válido----*/
const validarId = (id) => {

    return (
        /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(Number(id))
    );

};


/*----Comprobamos qué citas puede consultar cada usuario según su rol----*/
const puedeConsultarCita = async (usuario, cita) => {

    const { id_usuario, rol } = usuario;

    if (rol === "admin") {
        return true;
    }

    if (rol === "artista") {

        return (
            Number(id_usuario) === Number(cita.id_artista)
        );

    }

    if (rol === "cliente") {

        const cliente = await clienteModel.getClienteByUsuarioId(
            id_usuario
        );

        if (!cliente) {
            return false;
        }

        return (
            Number(cliente.id_cliente) ===
            Number(cita.id_cliente)
        );

    }

    return false;

};


//==========OBTENER CITAS SEGÚN EL ROL=========//

const getCitas = async (req, res) => {

    try {

        const { id_usuario, rol } = req.usuario;

        let resultado;

        if (rol === "admin") {

            resultado = await citaModel.getCitas();

        } else if (rol === "cliente") {

            resultado = await citaModel.getCitasByCliente(id_usuario);

        } else if (rol === "artista") {

            resultado = await citaModel.getCitasByArtista(id_usuario);

        } else {

            return res.status(403).json({
                error: "No tienes permiso para consultar las citas"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ha ocurrido un error al obtener las citas"
        });

    }

};


//========OBTENER CITA POR SU ID========//

const getCitaById = async (req, res) => {

    try {

        const { id_cita } = req.params;

        if (!validarId(id_cita)) {

            return res.status(400).json({
                error: "El identificador de la cita no es válido"
            });

        }

        const resultado = await citaModel.getCitaById(id_cita);

        if (!resultado) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        const tienePermiso = await puedeConsultarCita(
            req.usuario,
            resultado
        );

        if (!tienePermiso) {

            return res.status(403).json({
                error: "No tienes permiso para consultar esta cita"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ha ocurrido un error al obtener la cita"
        });

    }

};


//========CREAR UNA CITA========//

const createCita = async (req, res) => {

    try {

        /*----Solo los clientes pueden solicitar citas----*/
        if (req.usuario.rol !== "cliente") {

            return res.status(403).json({
                error: "Solo los clientes pueden solicitar citas"
            });

        }

        const {
            id_artista,
            id_servicio,
            fecha,
            hora
        } = req.body;

        /*----Buscamos la ficha del cliente autenticado----*/
        const cliente = await clienteModel.getClienteByUsuarioId(
            req.usuario.id_usuario
        );

        if (!cliente) {

            return res.status(404).json({
                error: "No existe una ficha de cliente asociada a este usuario"
            });

        }

        const id_cliente = cliente.id_cliente;

        /*----Comprobamos que estén todos los datos obligatorios----*/
        if (
            id_artista == null ||
            id_servicio == null ||
            !fecha ||
            !hora
        ) {

            return res.status(400).json({
                error: "Faltan datos obligatorios para crear la cita"
            });

        }

        /*----Validamos los identificadores----*/
        if (
            !validarId(id_artista) ||
            !validarId(id_servicio)
        ) {

            return res.status(400).json({
                error: "El artista o el servicio no son válidos"
            });

        }



        /*----Comprobamos que el artista exista y esté activo----*/
        const artista = await artistaModel.getArtistaById(id_artista);

        if (!artista || artista.activo === false) {

            return res.status(404).json({
                error: "El artista seleccionado no está disponible"
            });

        }


        /*----NUEVA VALIDACIÓN: comprobar que el artista ofrece el servicio----*/
        const ofreceServicio = await citaModel.artistaOfreceServicio(
            id_artista,
            id_servicio
        );

        if (!ofreceServicio) {

            return res.status(400).json({
                error: "El artista seleccionado no ofrece este servicio"
            });

        }

        /*----Comprobamos que la fecha sea válida----*/
        if (!validarFecha(fecha)) {

            return res.status(400).json({
                error: "La fecha debe ser válida y tener formato AAAA-MM-DD"
            });

        }

        /*----Impedimos reservar fechas pasadas----*/
        if (!validarFechaNoPasada(fecha)) {

            return res.status(400).json({
                error: "No puedes solicitar una cita en una fecha pasada"
            });

        }

        /*----Validamos el horario de la cita----*/
        if (!validarHora(hora)) {

            return res.status(400).json({
                error: "Las citas deben comenzar entre las 13:30 y las 21:00, en punto o a y media"
            });

        }

        /*----Creamos la cita en estado pendiente----*/
        const resultado = await citaModel.createCita(
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            "pendiente"
        );

        return res.status(201).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ha ocurrido un error al crear la nueva cita"
        });

    }

};


//=======ACTUALIZAR CITA=======//

const updateCita = async (req, res) => {

    try {

        const { id_cita } = req.params;

        /*----Solo artistas y administradores pueden actualizar citas----*/
        if (
            req.usuario.rol !== "artista" &&
            req.usuario.rol !== "admin"
        ) {

            return res.status(403).json({
                error: "Solo los artistas y administradores pueden actualizar citas"
            });

        }

        /*----Validamos el ID de la cita----*/
        if (!validarId(id_cita)) {

            return res.status(400).json({
                error: "El identificador de la cita no es válido"
            });

        }

        /*----Buscamos la cita existente----*/
        const citaExistente = await citaModel.getCitaById(id_cita);

        if (!citaExistente) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        /*----El artista solo puede modificar sus propias citas----*/
        if (
            req.usuario.rol === "artista" &&
            Number(req.usuario.id_usuario) !==
            Number(citaExistente.id_artista)
        ) {

            return res.status(403).json({
                error: "No tienes permiso para modificar esta cita"
            });

        }

        const {
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos
        } = req.body;

        /*----Comprobamos que estén todos los datos obligatorios----*/
        if (
            id_cliente == null ||
            id_artista == null ||
            id_servicio == null ||
            !fecha ||
            !hora ||
            !estado
        ) {

            return res.status(400).json({
                error: "Faltan datos obligatorios para actualizar la cita"
            });

        }

        /*----Validamos los identificadores----*/
        if (
            !validarId(id_cliente) ||
            !validarId(id_artista) ||
            !validarId(id_servicio)
        ) {

            return res.status(400).json({
                error: "Alguno de los identificadores no es válido"
            });

        }

        /*----Definimos los estados permitidos----*/
        const estadosPermitidos = [
            "pendiente",
            "confirmada",
            "cancelada"
        ];

        if (!estadosPermitidos.includes(estado)) {

            return res.status(400).json({
                error: "El estado de la cita no es válido"
            });

        }

        /*----El artista no puede cambiar el profesional, cliente o servicio----*/
        if (req.usuario.rol === "artista") {

            if (
                Number(id_artista) !==
                Number(citaExistente.id_artista)
            ) {

                return res.status(403).json({
                    error: "No puedes asignar esta cita a otro artista"
                });

            }

            if (
                Number(id_cliente) !==
                Number(citaExistente.id_cliente)
            ) {

                return res.status(403).json({
                    error: "No puedes cambiar el cliente de esta cita"
                });

            }

            if (
                Number(id_servicio) !==
                Number(citaExistente.id_servicio)
            ) {

                return res.status(403).json({
                    error: "No puedes cambiar el servicio de esta cita"
                });

            }

        }

        /*----NUEVA VALIDACIÓN: comprobar que el artista ofrece el servicio----*/
        const ofreceServicio = await citaModel.artistaOfreceServicio(
            id_artista,
            id_servicio
        );

        if (!ofreceServicio) {

            return res.status(400).json({
                error: "El artista seleccionado no ofrece este servicio"
            });

        }

        /*----Comprobamos que la fecha sea válida----*/
        if (!validarFecha(fecha)) {

            return res.status(400).json({
                error: "La fecha debe ser válida y tener formato AAAA-MM-DD"
            });

        }

        /*----Impedimos actualizar citas a fechas pasadas----*/
        if (!validarFechaNoPasada(fecha)) {

            return res.status(400).json({
                error: "No puedes actualizar una cita a una fecha pasada"
            });

        }

        /*----Validamos el horario----*/
        if (!validarHora(hora)) {

            return res.status(400).json({
                error: "La hora debe estar entre las 13:30 y las 21:00, en punto o a y media"
            });

        }

        /*----Comprobamos que la duración sea positiva y múltiplo de 30----*/
        if (
            duracion_minutos != null &&
            (
                !Number.isInteger(duracion_minutos) ||
                duracion_minutos <= 0 ||
                duracion_minutos % 30 !== 0
            )
        ) {

            return res.status(400).json({
                error: "La duración debe ser un número entero positivo y múltiplo de 30 minutos"
            });

        }

        /*----Para confirmar una cita comprobamos duración y solapamientos----*/
        if (estado === "confirmada") {

            if (duracion_minutos == null) {

                return res.status(400).json({
                    error: "Para confirmar una cita debes indicar su duración"
                });

            }

            /*----Calculamos la hora de finalización----*/
            const inicioMinutos = convertirHoraAMinutos(hora);
            const finMinutos = inicioMinutos + duracion_minutos;

            const cierre = 21 * 60 + 30;

            if (finMinutos > cierre) {

                return res.status(400).json({
                    error: "La cita no puede terminar después de las 21:30"
                });

            }

            /*----Comprobamos que no exista otra cita confirmada en ese horario----*/
            const haySolapamiento = await citaModel.comprobarSolapamiento(
                id_artista,
                fecha,
                hora,
                duracion_minutos,
                id_cita
            );

            if (haySolapamiento) {

                return res.status(409).json({
                    error: "El artista ya tiene una cita en ese horario"
                });

            }

        }

        /*----Actualizamos la cita después de todas las comprobaciones----*/
        const resultado = await citaModel.updateCita(
            id_cita,
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos ?? null
        );

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ha ocurrido un error al actualizar la cita"
        });

    }

};


//=======ELIMINAR CITA=======//

const deleteCita = async (req, res) => {

    try {

        /*----Solo los administradores pueden eliminar citas----*/
        if (req.usuario.rol !== "admin") {

            return res.status(403).json({
                error: "Solo los administradores pueden eliminar citas"
            });

        }

        const { id_cita } = req.params;

        if (!validarId(id_cita)) {

            return res.status(400).json({
                error: "El identificador de la cita no es válido"
            });

        }

        const resultado = await citaModel.deleteCita(id_cita);

        if (!resultado) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ha ocurrido un error al eliminar la cita"
        });

    }

};


//=======CONSULTA HORARIOS DISPONIBLES=======//

const getDisponibilidad = async (req, res) => {

    try {

        /*----Recogemos el artista y la fecha----*/
        const { id_artista, fecha } = req.query;

        if (!id_artista || !fecha) {

            return res.status(400).json({
                error: "Debes indicar el artista y la fecha"
            });

        }

        if (!validarId(id_artista)) {

            return res.status(400).json({
                error: "El identificador del artista no es válido"
            });

        }

        if (!validarFecha(fecha)) {

            return res.status(400).json({
                error: "La fecha indicada no es válida"
            });

        }


        /*----Comprobamos que el artista exista y esté activo----*/
        const artista = await artistaModel.getArtistaById(id_artista);

        if (!artista || artista.activo === false) {

            return res.status(404).json({
                error: "El artista seleccionado no está disponible"
            });

        }


        /*----Consultamos las citas confirmadas del artista----*/
        const citasOcupadas = await citaModel.getCitasOcupadas(
            id_artista,
            fecha
        );

        const apertura = 13 * 60 + 30;
        const cierre = 21 * 60 + 30;

        const horariosDisponibles = [];

        /*----Recorremos el horario de media hora en media hora----*/
        for (
            let minuto = apertura;
            minuto < cierre;
            minuto += 30
        ) {

            const estaOcupado = citasOcupadas.some((cita) => {

                const inicioCita = convertirHoraAMinutos(
                    cita.hora.slice(0, 5)
                );

                const finCita = inicioCita + cita.duracion_minutos;

                return (
                    minuto >= inicioCita &&
                    minuto < finCita
                );

            });

            if (!estaOcupado) {

                const horas = Math.floor(minuto / 60);
                const minutos = minuto % 60;

                const horaFormateada =
                    String(horas).padStart(2, "0") +
                    ":" +
                    String(minutos).padStart(2, "0");

                horariosDisponibles.push(horaFormateada);

            }

        }

        return res.status(200).json({
            id_artista: Number(id_artista),
            fecha,
            horarios_disponibles: horariosDisponibles
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ha ocurrido un error al consultar la disponibilidad"
        });

    }

};


//=======EXPORTAR FUNCIONES=======//

module.exports = {
    getCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    getDisponibilidad
};
