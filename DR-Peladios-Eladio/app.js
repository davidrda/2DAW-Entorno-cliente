'use strict';

const TIENDA = {
    nombre: 'Peladillos Eladio',
    divisa: 'EUR',
    idioma: 'es-ES',
    edadMinima: 16
};

const SERVICIOS = [
    {
        id: 'clasico',
        name: 'Corte clásico',
        precio: 12,
        duracion: 25,
    },

    {
        id: 'Tupper fade',
        name: 'Corte fade',
        precio: 15,
        duracion: 35,
    },

    {
        id: 'Brocoli',
        name: 'Corte brocoli',
        precio: 20,
        duracion: 15,
    },
];

const EXTRAS = {
    lavado: {
        nombre: 'Lavado gostoso',
        precio: 100
    },

    cejas: {
        nombre: 'Pulido de cejas',
        precio: 3
    },
};

const DESCUENTO_MIEMBROS = 0.05;

const CODIGO_CUPON = 'ELADIO10';

const CUPON_DESCUENTO = 0.10;

const servicesGrid = document.querySelector('#servicesGrid');

const serviceSelect = document.querySelector('#serviceSelect');

const bookingForm = document.querySelector('#bookingForm');

const ticketContent = document.querySelector('#ticketContent');

const formMessage = document.querySelector('#formMessage');

// Le da formato al dinero
function formatMoney(importe) {
    const formatter = new Intl.NumberFormat(
        TIENDA.idioma,
        {
            style: 'currency',
            currency: TIENDA.divisa
        }
    );

    return formatter.format(importe);
}

// Reemplaza carácteres HTML por String
function escapeHtml(value) {
    return String(value)

        .replaceAll('&', '&amp;')

        .replaceAll('<', '&lt;')

        .replaceAll('>', '&gt;')

        .replaceAll('"', '&quot;')

        .replaceAll("'", '&#039;');
}

// Buscas servicio, te devuelve el primero que encuentra con ese ID
function buscarServicio(id) {
    return SERVICIOS.find(
        (servicio) => servicio.id === id
    );
}

// Renderizado de servicios mediante innerHTML
function renderizarServicios() {

    let cardsHtml = '';

    // selected: opción seleccionada por defecto
    // disabled: esa opción sale en gris, no se puede pulsar
    let optionHtml = `
     <option value="" selected disabled>
        - Selecciona el servicio -
     </option>

    `;


    for (const servicio of SERVICIOS) {

        cardsHtml += `
          <article class="card">

              <h3>${servicio.name}</h3>

              <p>${servicio.duracion} min</p>

              <span class="price">
                  ${formatMoney(servicio.precio)}
              </span>

          </article>
        `;

        optionHtml += `
            <option value="${servicio.id}">
                ${servicio.name} - ${formatMoney(servicio.precio)}
            </option>
        `;
    }

        // se renderizan las cards dentro del HTML de servicesGrid
        servicesGrid.innerHTML = cardsHtml;

        // se renderizan las opciones dentro del HTML de serviceSelect
        serviceSelect.innerHTML = optionHtml;

}
// Renderizado de servicios mediante elementos del DOM
function renderizarServiciosCreate() {

    for (const servicio of SERVICIOS) {

        const article = document.createElement('article'); // creas un article

        article.classList.add('card'); // le añades la clase 'card'

        const title = document.createElement('h3'); // creas un title h3

        title.textContent = servicio.name; // a title le insertas el nombre del servicio

        const duracion = document.createElement('p'); // creas duración como un p

        duracion.textContent = `${servicio.duracion} min`; // a duración le insertas los min

        const precio = document.createElement('span'); // creas precio como un span

        precio.classList.add('price'); // a precio le insertas la clase 'price'

        precio.textContent = formatMoney(servicio.precio); // a precio le insertas el precio formateado

        // al articulo le añades titulo, duracion y precio
        article.append(
            title,
            duracion,
            precio
        );

        // añades el artículo a servicesGrid
        servicesGrid.append(article);
    }
}

// Retorna los datos puestos en el formulario
function leerFormulario() {

    // Lee todo el formulario de una vez, luego puedes sacar su value con un .get
    // Por ejemplo: En el formulario pongo David, entonces clientName="David", y así con todo
    const datos = new FormData(bookingForm);

    // Guardo en una variable nombre gracias a 'datos'
    // .get me da el value que le pida, en este caso del clientName, sino devuelve nulo
    // .trim le quita los espacios del principio y del final
    const nombre = String(
        datos.get('clientName') ?? ''
    ).trim();

    // datos.get devuelve la edad pero pasado a Number
    const edad = Number(
        datos.get('age')
    );

    // datos.getAll devuelve todos los extras que seleccione y los mapea a String
    const extras = datos
        .getAll('extras')
        .map(String);

    // Pasa a String el cupon (si está vacio devuelve nulo) y elimina espacios y pasa a MAYUS
    const coupon = String(datos.get('coupon') ?? '')
        .trim()
        .toUpperCase();

    const servicioId = String(
        datos.get('service') ?? ''
    );

    const dia = String(
        datos.get('day') ?? ''
    );

    // Devuelve true si member es 'on'
    const esMiembro = datos.get('member') === 'on';

    return {
        nombre,
        edad,
        servicioId,
        dia,
        extras,
        coupon,
        esMiembro
    };
}

// Se valida y se reunen errores si hay
function validarReserva(reserva) {

    const errores = [];
    
    // si no escribes nombre:
    if (!reserva.nombre) {
        errores.push('Escribe tu nombre');
    }

    // si no pones un número:
    if (Number.isNaN(reserva.edad)) {
        errores.push('La edad debe de ser un número');
    } else if ( // si pones un número, se valida que este dentro del rango permitido
        reserva.edad < TIENDA.edadMinima ||
        reserva.edad > 120
    ) {
        errores.push(
            `La edad debe de estar entre ${TIENDA.edadMinima} y 120`
        );
    }

    // si no existe el servicio:
    if (!buscarServicio(reserva.servicioId)) {
        errores.push('El servicio no existe');
    }

    // si no has seleccionado dia
    if (!reserva.dia) {
        errores.push('Selecciona un día');
    }

    return errores;
}


function calcularReserva(reserva) {

    const servicio = buscarServicio(reserva.servicioId);

    // buscas el precio del servicio y se guarda en el subtotal
    // servicio?.precio: accede al precio si servicio existe
    // "?? 0": si lo de la izquierda es null o undefined, usa lo de la derecha
    let subtotal = servicio?.precio ?? 0;

    const extrasDetalle = [];

    // Objetivo: sacar el subtotal
    for (const extraID of reserva.extras) {

        // guarda cada extra en cada vuelta
        const extra = EXTRAS[extraID];

        // si no existe, ve a la siguiente vuelta
        if (!extra) {
            continue;
        }

        // al subtotal le sumas el precio del extra y lo insertas en extrasDetalle
        subtotal +=  extra.precio;
        extrasDetalle.push(extra);
    }

        let porcentajeDescuento = 0;

        if(reserva.esMiembro) {
            porcentajeDescuento += DESCUENTO_MIEMBROS;
        }

        if (reserva.coupon === CODIGO_CUPON){
            porcentajeDescuento += CUPON_DESCUENTO;
        }

        const descuento = subtotal * porcentajeDescuento;

        const total = subtotal - descuento;

        return {
            servicio,
            extrasDetalle,
            subtotal,
            porcentajeDescuento,
            descuento,
            total
        };
}

function obtenerMensajeEdad(edad){
    if (edad < TIENDA.edadMinima){
        return 'No cumples con la edad mínima'
    } else if (edad >= 65) {
        return ' bienvenido jubilado!'
    } else {
        return 'Contamos contigo!'
    }
}

function obtenerMensajeDia(dia){
    switch (dia) {
        case 'Lunes':
            return 'Empezar a tope la semana!'
        case 'Viernes':
            return 'Acabar a tope la semana!'
        case 'Sábado':
            return 'Bendito sábado!'
        default:
            return 'Un buen día para retocarse!'
    }
}

function renderizarTicket() {

    // Lees el formulario: nombre, edad, etc...
    const reserva = leerFormulario();

    // Calculas la reserva: subtotal, total, etc...
    const resultado = calcularReserva(reserva);

    // Coge el nombre del servicio que se ha seleccionado en la reserva
    // Coge el nombre si servicio existe (.servicio?.name)
    // " ?? 'Sin seleccionar' ": si lo de la izquierda es null, usa lo de la derecha
    const nombreServicio =
        resultado.servicio?.name ?? 'Sin seleccionar';

    // Coge el nombre del extra (cogido de la reserva) y separalas por ,
    const nombresExtras = resultado.extrasDetalle
        .map(extra => extra.nombre)
        .join(', ');

    // Pones la info que has recogido en el ticket (RESUMEN DE LA RESERVA)
    ticketContent.innerHTML = `
            <div class="ticket-row">
                <span>Cliente</span>
                <strong>${escapeHtml(reserva.nombre || 'Sin indicar')} </strong>
            </div>

            <div class="ticket-row">
                <span>Servicio</span>
                <strong>${escapeHtml(nombreServicio)}</strong>
            </div>

            <div class="ticket-row">
                <span>Día</span>
                <strong>${escapeHtml(reserva.dia|| 'Sin seleccionar')} </strong>
            </div>

            <div class="ticket-row">
                <span>Extras</span>
                <strong>${escapeHtml(nombresExtras || 'Ninguno')} </strong>
            </div>

            <div class="ticket-row">
                <span>Miembro</span>
                <strong>${reserva.esMiembro ? 'Sí' : 'No'} </strong>
            </div>

            <div class="ticket-row">
                <span>Subtotal</span>
                <strong>${formatMoney(resultado.subtotal)} </strong>
            </div>

            <div class="ticket-row">
                <span>Descuento</span>
                <strong>${formatMoney(resultado.descuento)} </strong>
            </div>

             <div class="ticket-row">
                <span>Total</span>
                <strong>${formatMoney(resultado.total)} </strong>
            </div>

    `;
}

// Cuando se produzca un submit en bookingForm, ejecuta esta función
// 1er parámetro: que acción hacer cuando se envía el formulario
// 2do parámetro: que hacer cuando ocurra (callback)
bookingForm.addEventListener( 'submit'  , function(event) {

    /*
        Significa: “cancela el comportamiento por defecto de este evento”.

        Qué hace un formulario por defecto

        Al pulsar el botón de enviar, el navegador hace esto:

        1. Envía los datos a la URL del action del formulario.
        2. Recarga la página.

        ---- Por qué es un problema aquí?

        Tú no quieres enviar nada ni recargar.
        Quieres que JavaScript procese los datos en la propia página. 
        
        Sin preventDefault():
            La página se recarga antes de que tu código termine.
            Se pierden el mensaje de formMessage y el ticket que acabas de pintar.
    */
    event.preventDefault();

    const reserva = leerFormulario();

    const errores = validarReserva(reserva);

    // Si hay errores, para aquí
    if (errores.length > 0) {
        formMessage.textContent = errores.join(' ');

        return;
    }

    const resultado = calcularReserva(reserva);

    formMessage.textContent=
     `Reserva preparada para ${reserva.nombre}. ` +
     `Total: ${formatMoney(resultado.total)}. `;

     renderizarTicket();
});

renderizarServicios();
