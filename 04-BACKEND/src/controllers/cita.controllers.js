
const citaModel = require("../models/cita.model");
const clienteModel = require("../models/cliente.model");


//=======COMPROBACIONES Y VALIDACIONES========//

/*----Comprobaremos que la fecha tiene el formato correcto y exista en nuestro calendario----*/
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



/*----Comprueba que la hora esté dentro del horario que tenemos permitido (13:30-21:30)----*/
const validarHora = (hora) => {

    if (

        typeof hora !== "string" ||

        !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)

    ) {

        return false;
    }

    const [horas, minutos] = hora.split(":").map(Number);

    const minutosTotales = horas * 60 + minutos;

    //Convertimos las horas de apertura y cierre a minutos para poder compararlas
    const apertura = 13 * 60 + 30;
    const cierre = 21 * 60 + 30;


    return (

        minutosTotales >= apertura &&
        minutosTotales < cierre &&
        (minutos === 0 || minutos === 30)

    );

};


// Convertimos una hora a minutos.
const convertirHoraAMinutos = (hora) => {

    const [horas, minutos] = hora.split(":").map(Number);

    return horas * 60 + minutos;

};


/*----Comprueba que el id sea un numero entero positivo y también valido----*/
const validarId = (id) => {

    return (

        /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(Number(id))

    );

};



/*----Sacamos el ID y el rol del usuario para comprobar qué citas puede ver----*/
const puedeConsultarCita = async (usuario, cita) => {

    const { id_usuario, rol } = usuario;

    // El administrador puede consultar cualquier cita.
    if (rol === "admin") {

        return true;

    }

    // El artista solo puede consultar las citas asignadas.
    if (rol === "artista") {

        return (

            Number(id_usuario) === Number(cita.id_artista)

        );

    }

    // El cliente solo puede consultar sus propias citas.
    if (rol === "cliente") {


        /*----Buscaremos la ficha del cliente asociada al usuario que ha iniciado sesiÓN---*/
        const cliente = await clienteModel.getClienteByUsuarioId(
            id_usuario
        );



        /*----Si el usuario no tiene ficha cliente, no le permitimos consultar la cita----*/
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


//==========OBTENER CITAS SEGUN EL ROL=========//

const getCitas = async (req, res) => {

    try {

        const { id_usuario, rol } = req.usuario;

        let resultado;

        /*----Dependiendo del rol, mostramos todas las citas o solo las que correspondan al usuario----*/
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


//========OBTENER CITAS POR SU ID========//

const getCitaById = async (req, res) => {

    try {

        /*----Cogemos el ID de la cita que nos llega por la URL----*/
        const { id_cita } = req.params;


        /*----Comprobamos que el ID sea válido antes de buscar la cita----*/
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

        /*----Antes de mostrar la cita,comprobamos que esta tiene pertenencia al usuario o que tiene permiso para verla---*/
        const tienePermiso = await puedeConsultarCita(req.usuario, resultado);
        

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

        /*----Comprobamos que quien solicita cita es un cliente----*/
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


        /*----Buscamos los datos del cliente que ha iniciado sesióm----*/
        const cliente = await clienteModel.getClienteByUsuarioId(req.usuario.id_usuario);

        if (!cliente) {

            return res.status(404).json({

                error: "No existe una ficha de cliente asociada a este usuario"

            });

        }


        /*----Usamos el ID de la ficha del cliente que ha iniciado sesión----*/
        const id_cliente = cliente.id_cliente;


        /*----Comprobamos que no falte ningún dato necesario para reservar la cita----*/
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

        if (
            !validarId(id_artista) ||
            !validarId(id_servicio)
        ) {

            return res.status(400).json({
                error: "El artista o el servicio no son válidos"
            });

        }

     
           /*----Comprobamos que la fecha tenga el formato correcto y exista realmente----*/
           if (!validarFecha(fecha)) {

            return res.status(400).json({

                error: "La fecha debe ser válida y tener formato AAAA-MM-DD"

            });

        }


        /*----Comprobamos que la hora sea dentro del horario del estudio----*/
        if (!validarHora(hora)) {

            return res.status(400).json({

                error: "Las citas deben comenzar entre las 13:30 y las 21:00, en punto o a y media"

            });

        }

        /*--- Guardamos la cita como pendiente hasta que el artista la confirme ---*/
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


        /*--- Comprobamos que sea un artista o administrador quien modifica la cita ---*/
        if (

            req.usuario.rol !== "artista" &&
            req.usuario.rol !== "admin"

        ) {

            return res.status(403).json({

                error: "Solo los artistas y administradores pueden actualizar citas"

            });

        }


        /*----Comprobamos que el ID de la cita sea válido antes de modificarla----*/
        if (!validarId(id_cita)) {

            return res.status(400).json({

                error: "El identificador de la cita no es válido"
            });

        }

        /*----Buscamos la cita que queremos modificar----*/
        const citaExistente = await citaModel.getCitaById(id_cita);


        if (!citaExistente) {

            return res.status(404).json({

                error: "Cita no encontrada"

            });

        }

        /*--- Comprobamos que el artista tenga asignada la cita que quiere modificar ---*/
        if (

            req.usuario.rol === "artista" &&
            Number(req.usuario.id_usuario) !==
            Number(citaExistente.id_artista)

        ) {

            return res.status(403).json({

                error: "No tienes permiso para modificar esta cita"

            });

        }


        /*---- Recogemos los datos de la cita que se quieren actualizar----*/
        const {

            id_cliente,
            id_artista,
            id_servicio,
            fecha,
            hora,
            estado,
            duracion_minutos

        } = req.body;


        /*----Comprobamos que estén todos los datos necesarios para actualizar la cita----*/
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


        /*----Comprobamos que los ID del cliente, artista y servicio sean válidos----*/
        if (

            !validarId(id_cliente) ||
            !validarId(id_artista) ||
            !validarId(id_servicio)

        ) {

            return res.status(400).json({

                error: "Alguno de los identificadores no es válido"

            });

        }


        /*----Definimos los estados que puede tener una cita----*/
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

        /*--- El artista puede actualizar su cita, pero no cambiar el cliente,
         el artista asignado ni el servicio ---*/
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
    

        /*----Comprobamos que la nueva fecha sea válida antes de guardar los cambios----*/
        if (!validarFecha(fecha)) {

            return res.status(400).json({

                error: "La fecha debe ser válida y tener formato AAAA-MM-DD"

            });

        }


        /*----La hora también tiene que respetar el horario del estudio----*/
        if (!validarHora(hora)) {

            return res.status(400).json({

                error: "La hora debe estar entre las 13:30 y las 21:00, en punto o a y media"

            });

        }

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





       /*--- Si indicamos una duración, comprobamos que sea un número entero mayor que cero ---*/
        if (estado === "confirmada") {

            if (duracion_minutos == null) {

                return res.status(400).json({

                    error: "Para confirmar una cita debes indicar su duración"
                    
                });

            }

            const inicioMinutos = convertirHoraAMinutos(hora);

            const finMinutos =
                inicioMinutos + duracion_minutos;

            const cierre = 21 * 60 + 30;

            if (finMinutos > cierre) {

                return res.status(400).json({
                    error: "La cita no puede terminar después de las 21:30"
                });

            }

            // Evitamos que coincidan dos citas confirmadas.
            const haySolapamiento =
                await citaModel.comprobarSolapamiento(
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


// =====================================================
// 6. ELIMINAR UNA CITA
// =====================================================

const deleteCita = async (req, res) => {

    try {

        // Solo el administrador puede eliminar citas.
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


// =====================================================
// 7. CONSULTAR HORARIOS DISPONIBLES
// =====================================================

const getDisponibilidad = async (req, res) => {

    try {

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

        const citasOcupadas =
            await citaModel.getCitasOcupadas(
                id_artista,
                fecha
            );

        const apertura = 13 * 60 + 30;
        const cierre = 21 * 60 + 30;

        const horariosDisponibles = [];

        // Generamos horas de inicio cada 30 minutos.
        for (
            let minuto = apertura;
            minuto < cierre;
            minuto += 30
        ) {

            const estaOcupado = citasOcupadas.some((cita) => {

                const inicioCita = convertirHoraAMinutos(
                    cita.hora.slice(0, 5)
                );

                const finCita =
                    inicioCita + cita.duracion_minutos;

                return (
                    minuto >= inicioCita &&
                    minuto < finCita
                );

            });

            if (!estaOcupado) {

                const horas = Math.floor(minuto / 60);
                const minutos = minuto % 60;

                const horaFormateada =
                    String(horas).padStart(2, "0") + ":" +
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


// =====================================================
// 8. EXPORTAR FUNCIONES
// =====================================================

module.exports = {
    getCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    getDisponibilidad
};
