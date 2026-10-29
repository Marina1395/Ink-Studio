
const citaModel = require("../models/cita.model");


//1.=====FUNCIONES AUXILIARES PARA VALIDAR FECHAS Y HORAS=====

// Comprobamos que la fecha tenga un formato correcto y exista
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


// Comprobamos el formato y horario de inicio
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


// Convertimos una hora a minutos
const convertirHoraAMinutos = (hora) => {

    const [horas, minutos] = hora.split(":").map(Number);

    return horas * 60 + minutos;

};


//2.=====OBTENER TODAS LAS CITAS=====

const getCitas = async (req, res) => {

    try {

        const resultado = await citaModel.getCitas();

        res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al obtener las citas"
        });

    }

};


//3.=====OBTENER CITA POR SU ID=====

const getCitaById = async (req, res) => {

    try {

        const { id_cita } = req.params;

        const resultado = await citaModel.getCitaById(id_cita);

        if (!resultado) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al obtener la cita"
        });

    }

};


//4.=====CREAR UNA CITA=====

const createCita = async (req, res) => {

    try {

        // Obtenemos los datos del cliente
        const {
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora
        } = req.body;


        // Comprobamos los campos obligatorios
        if (
            id_cliente == null ||
            id_artista == null ||
            id_servicio == null ||
            !fecha ||
            !hora
        ) {

            return res.status(400).json({
                error: "Faltan datos obligatorios para crear la cita"
            });

        }


        // Validamos la fecha
        if (!validarFecha(fecha)) {

            return res.status(400).json({
                error: "La fecha debe ser válida y tener formato AAAA-MM-DD"
            });

        }


        // Validamos la hora y el horario del estudio
        if (!validarHora(hora)) {

            return res.status(400).json({
                error: "Las citas deben comenzar entre las 13:30 y las 21:00, en punto o a y media"
            });

        }


        // Creamos la cita inicialmente como pendiente
        const resultado = await citaModel.createCita(
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            "pendiente"
        );


        res.status(201).json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al crear la nueva cita"
        });

    }

};


//5.=====ACTUALIZAR UNA CITA=====

const updateCita = async (req, res) => {

    try {

        const { id_cita } = req.params;

        const {
            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos
        } = req.body;


        // Comprobamos que la cita exista
        const citaExistente = await citaModel.getCitaById(id_cita);

        if (!citaExistente) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }


        // Validamos los datos obligatorios
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


        // Validamos la fecha
        if (!validarFecha(fecha)) {

            return res.status(400).json({
                error: "La fecha debe ser válida y tener formato AAAA-MM-DD"
            });

        }


        // Validamos el horario de inicio
        if (!validarHora(hora)) {

            return res.status(400).json({
                error: "La hora debe estar entre las 13:30 y las 21:00, en punto o a y media"
            });

        }


        // Validamos la duración si se proporciona
        if (
            duracion_minutos != null &&
            (
                !Number.isInteger(duracion_minutos) ||
                duracion_minutos <= 0
            )
        ) {

            return res.status(400).json({
                error: "La duración debe ser un número entero mayor que cero"
            });

        }


        // Si confirmamos una cita, comprobamos su disponibilidad
        if (estado === "confirmada") {

            // No podemos confirmar sin conocer la duración
            if (duracion_minutos == null) {

                return res.status(400).json({
                    error: "Para confirmar una cita debes indicar su duración"
                });

            }


            // Comprobamos que termine antes del cierre
            const inicioMinutos = convertirHoraAMinutos(hora);

            const finMinutos = inicioMinutos + duracion_minutos;

            const cierre = 21 * 60 + 30;

            if (finMinutos > cierre) {

                return res.status(400).json({
                    error: "La cita no puede terminar después de las 21:30"
                });

            }


            // Comprobamos si se solapa con otra cita confirmada
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


        // Actualizamos la cita en PostgreSQL
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


        res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al actualizar la cita"
        });

    }

};


//6.=====ELIMINAR UNA CITA=====

const deleteCita = async (req, res) => {

    try {

        const { id_cita } = req.params;

        const resultado = await citaModel.deleteCita(id_cita);

        if (!resultado) {

            return res.status(404).json({
                error: "Cita no encontrada"
            });

        }

        res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al eliminar la cita"
        });

    }

};




//7.=====OBTENER HORARIOS DISPONIBLES DE UN ARTISTA=====

const getDisponibilidad = async (req, res) => {

    try {

        //1.=====RECIBIMOS EL ARTISTA Y LA FECHA=====
        const { id_artista, fecha } = req.query;


        //2.=====VALIDAMOS LOS DATOS=====
        if (!id_artista || !fecha) {

            return res.status(400).json({
                error: "Debes indicar el artista y la fecha"
            });

        }

        if (
            !/^[1-9]\d*$/.test(String(id_artista)) ||
            !Number.isSafeInteger(Number(id_artista))
        ) {

            return res.status(400).json({
                error: "El identificador del artista no es válido"
            });

        }

        if (!validarFecha(fecha)) {

            return res.status(400).json({
                error: "La fecha indicada no es válida"
            });

        }


        //3.=====CONSULTAMOS LAS CITAS CONFIRMADAS=====
        const citasOcupadas = await citaModel.getCitasOcupadas(
            id_artista,
            fecha
        );


        //4.=====GENERAMOS HORAS EN PUNTO Y A Y MEDIA=====
        const apertura = 13 * 60 + 30;
        const cierre = 21 * 60 + 30;

        const horariosDisponibles = [];

        for (let minuto = apertura; minuto < cierre; minuto += 30) {

            // Comprobamos si esta hora está ocupada
            const estaOcupado = citasOcupadas.some((cita) => {

                const inicioCita = convertirHoraAMinutos(
                    cita.hora.slice(0, 5)
                );

                const finCita = inicioCita + cita.duracion_minutos;

                return minuto >= inicioCita && minuto < finCita;

            });


            // Si no está ocupada, la añadimos a la lista
            if (!estaOcupado) {

                const horas = Math.floor(minuto / 60);
                const minutos = minuto % 60;

                const horaFormateada =
                    String(horas).padStart(2, "0") + ":" +
                    String(minutos).padStart(2, "0");

                horariosDisponibles.push(horaFormateada);

            }

        }


        //5.=====DEVOLVEMOS LOS HORARIOS DISPONIBLES=====
        res.status(200).json({
            id_artista: Number(id_artista),
            fecha,
            horarios_disponibles: horariosDisponibles
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Ha ocurrido un error al consultar la disponibilidad"
        });

    }

};



//7.=====EXPORTAR FUNCIONES=====

module.exports = {
    getCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    getDisponibilidad
};
