'use strict';

// Peladillos Eladio: reserva de servicios de barbería.
// Flujo: DATOS -> funciones que los procesan -> HTML que ve el usuario.


// ============================================================================
// DATOS
// ============================================================================

// Objeto: agrupa datos relacionados. Se accede con TIENDA.nombre.
// const impide reasignar TIENDA, pero sus propiedades SÍ se pueden modificar.
const TIENDA = {
    nombre: 'Peladillos Eladio',
    divisa: 'EUR',
    idioma: 'es-ES',
    edadMinima: 16
};

// Array de objetos. Los índices empiezan en 0: SERVICIOS[0].name -> 'Corte clásico'
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

// Objeto de objetos: se accede por clave, no por posición.
// Las tres formas dan el mismo dato:
//   EXTRAS.lavado.nombre | EXTRAS['lavado'].nombre | EXTRAS.lavado['nombre']
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

// Constantes con nombre en vez de números "mágicos" (0.05 = 5 %).
const DESCUENTO_MIEMBROS = 0.05;

const CODIGO_CUPON = 'ELADIO10';

const CUPON_DESCUENTO = 0.10;


// ============================================================================
// ELEMENTOS DEL DOM
// ============================================================================

// querySelector('#id') busca el elemento con ese id. Guardamos la referencia
// para poder modificarlo desde JS.
const servicesGrid = document.querySelector('#servicesGrid');

const serviceSelect = document.querySelector('#serviceSelect');

const bookingForm = document.querySelector('#bookingForm');

const ticketContent = document.querySelector('#ticketContent');

const formMessage = document.querySelector('#formMessage');


// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Número -> texto con formato de dinero. formatMoney(10) -> "10,00 €"
function formatMoney(importe) {

    // Intl.NumberFormat usa el idioma y la divisa de TIENDA.
    const formatter = new Intl.NumberFormat(
        TIENDA.idioma,
        {
            style: 'currency',
            currency: TIENDA.divisa
        }
    );

    return formatter.format(importe);
}

// Convierte caracteres especiales en entidades HTML para que se muestren
// como texto y no como etiquetas (evita XSS con innerHTML).
// OJO: & va PRIMERO. Si fuera después, volvería a escapar el & de &lt;, &gt;...
function escapeHtml(value) {

    return String(value)

        .replaceAll('&', '&amp;')

        .replaceAll('<', '&lt;')

        .replaceAll('>', '&gt;')

        .replaceAll('"', '&quot;')

        .replaceAll("'", '&#039;');

}

// find() devuelve el PRIMER elemento que cumpla la condición, o undefined
// si ninguno la cumple.
function buscarServicio(id) {

    return SERVICIOS.find(

        // Función flecha: "¿el id de este servicio es el que busco?"
        (servicio) => servicio.id === id

    );

}


// ============================================================================
// PINTAR SERVICIOS
// ============================================================================

// Versión 1: construir HTML como texto y volcarlo con innerHTML.
function renderizarServicios() {

    let cardsHtml = '';
    // La primera opción del <select> es un texto guía: aparece marcada
    // (selected) pero no se puede elegir (disabled) y su value está vacío.
    let optionHtml = `
        <option value="" selected disabled>
        - Selecciona el servicio -
        </option>
    `;

    for (const servicio of SERVICIOS) {

        // += AÑADE al texto anterior (con = se perdería la tarjeta previa).
        // Los template literals (` `) permiten varias líneas y ${expresión}.
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

    // Se asigna UNA vez, fuera del bucle.
    servicesGrid.innerHTML = cardsHtml;
    serviceSelect.innerHTML = optionHtml;

}

// Versión 2: crear nodos del DOM uno a uno (sin interpretar HTML).
// Más código, pero más seguro: textContent nunca ejecuta etiquetas.
function renderizarServiciosCreate() {

    // En cada vuelta, "servicio" es UNO de los objetos del array.
    // const vale porque cada vuelta crea una variable nueva.
    for (const servicio of SERVICIOS) {

        // createElement crea el nodo, pero NO aparece en la página
        // hasta que se añade a un elemento que ya esté en el documento.
        const article = document.createElement('article');

        article.classList.add('card');

        const title = document.createElement('h3');

        // textContent inserta TEXTO: '<strong>' se vería literal.
        // innerHTML lo interpretaría como etiqueta.
        title.textContent = servicio.name;

        const duracion = document.createElement('p');

        duracion.textContent = `${servicio.duracion} min`;

        const precio = document.createElement('span');

        precio.classList.add('price');

        precio.textContent = formatMoney(servicio.precio);

        // append() mete los nodos como hijos; el orden importa.
        article.append(
            title,
            duracion,
            precio
        );

        // Último paso: conectar la tarjeta a la página.
        servicesGrid.append(article);

    }

}


// ============================================================================
// FORMULARIO
// ============================================================================

// Lee el formulario y devuelve un objeto con tipos ya correctos
// (string, number, array, boolean). Solo LEE: no valida ni calcula.
function leerFormulario() {

    // FormData lee los campos por su atributo name (no por id).
    const datos = new FormData(bookingForm);

    // Se lee de dentro hacia fuera:
    //   get()  -> valor del campo, o null si no existe
    //   ??     -> si es null/undefined, usa ''
    //   String -> asegura tipo texto
    //   trim   -> quita espacios de los extremos (devuelve un string nuevo)
    const nombre = String(
        datos.get('clientName') ?? ''
    ).trim();

    // Los campos de formulario siempre llegan como TEXTO.
    // '25' + 1 daría '251'; Number('25') + 1 da 26.
    // Si no es numérico, Number() devuelve NaN (se comprueba en validarReserva).
    const edad = Number(
        datos.get('age')
    );

    // get() solo devuelve el PRIMER valor; getAll() devuelve todos en un array.
    // Varios checkbox con el mismo name="extras" -> ['lavado', 'cejas'] o [].
    const extras = datos
        .getAll('extras')
        .map(String);

    // Normaliza el cupón: '  eladio10  ' -> 'ELADIO10'.
    const coupon = String(
        datos.get('coupon') ?? ''
    )
        .trim()
        .toUpperCase();

    // Guardamos el id (value de la opción), no el precio:
    // el precio se recupera luego con buscarServicio().
    const servicioId = String(
        datos.get('service') ?? ''
    );

    const dia = String(
        datos.get('day') ?? ''
    );

    // Checkbox: marcado -> 'on'; sin marcar -> null (no true/false).
    const esMiembro = datos.get('member') === 'on';

    // Propiedad abreviada: { nombre } equivale a { nombre: nombre }.
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

// Devuelve un array con TODOS los errores (vacío = reserva válida).
// No los muestra: eso lo decide quien la llame.
function validarReserva(reserva) {

    const errores = [];

    // '' es false, y trim() ya convirtió "   " en ''.
    if (!reserva.nombre) {

        errores.push('Escribe tu nombre');

    }

    // OJO: NaN === NaN es false, por eso se usa Number.isNaN().
    if (Number.isNaN(reserva.edad)) {

        errores.push('La edad debe de ser un número');

    } else if (
        reserva.edad < TIENDA.edadMinima ||
        reserva.edad > 120
    ) {

        errores.push(
            `La edad debe de estar entre ${TIENDA.edadMinima} y 120`
        );

    }

    // buscarServicio() devuelve undefined si no existe -> !undefined es true.
    if (!buscarServicio(reserva.servicioId)) {

        errores.push('El servicio no existe');

    }

    if (!reserva.dia) {

        errores.push('Selecciona un día');

    }

    return errores;

}


// ============================================================================
// CÁLCULO DEL PRECIO (EJERCICIO)
// ============================================================================

// Recibe el objeto de leerFormulario() y devuelve { subtotal, descuento, total }.
// No debe modificar SERVICIOS, EXTRAS ni la reserva recibida.
function calcularReserva(reserva) {

    const servicio = buscarServicio(reserva.servicioId);

    // ?. evita error si servicio es undefined; ?? 0 da un valor por defecto.
    // let porque subtotal cambiará al sumar los extras.
    let subtotal = servicio?.precio ?? 0;

    // Array donde guardaremos los objetos completos de los extras elegidos
    // (con nombre y precio), para poder mostrarlos luego en el ticket.
    const extrasDetalle = [];

    // Recorre las claves de los extras marcados: ['lavado', 'cejas']
    for (const extra of reserva.extras) {

        // Busca el objeto del extra en EXTRAS usando la clave.
        const datosExtra = EXTRAS[extra];

        // Si la clave no existe en EXTRAS (undefined), salta al siguiente extra.
        if (!datosExtra) {
            continue;
        }

        // Suma el precio del extra al subtotal.
        subtotal +=  datosExtra.precio;

        // Guarda el extra para el detalle del ticket.
        extrasDetalle.push(datosExtra);

    }

    // Del bucle hacia fuera: esto se calcula UNA sola vez, con todos los
    // extras ya sumados.

    // Porcentaje de descuento acumulado (0.05 = 5 %). Empieza en 0.
    let porcentajeDescuento = 0;

    // Descuento por ser miembro.
    if(reserva.esMiembro) {
        porcentajeDescuento += DESCUENTO_MIEMBROS;
    }

    // Descuento por cupón: solo si el código coincide.
    if (reserva.coupon === CODIGO_CUPON){
        porcentajeDescuento += CUPON_DESCUENTO;
    }

    // Euros que se descuentan = subtotal * porcentaje.
    const descuento = subtotal * porcentajeDescuento;

    // Lo que paga el cliente.
    const total = subtotal - descuento;

    // Devuelve todos los datos del cálculo en un objeto.
    return {
        servicio,
        extrasDetalle,
        subtotal,
        porcentajeDescuento,
        descuento,
        total
    };

}

// Devuelve un mensaje distinto según la edad del cliente.
function obtenerMensajeEdad(edad){
    // Menor que la edad mínima de la tienda (16).
    if (edad < TIENDA.edadMinima){
        return 'No cumples con la edad mínima'
    } else if (edad >= 65) {
        return ' bienvenido jubilado!'
    } else {
        return 'Contamos contigo!'
    }
}

// Devuelve un mensaje según el día elegido.
// switch compara "dia" con cada case; return corta la función al acertar.
function obtenerMensajeDia(dia){

    switch (dia) {

        case 'Lunes':
            return 'Empezar a tope la semana!'
        case 'Viernes':
            return 'Acabar a tope la semana!'
        case 'Sábado':
            return 'Bendito sábado!'
        // default: se ejecuta si el día no coincide con ningún case.
        default:
            return 'Un buen día para retocarse!' 
    }


}

// Prepara los datos para pintar el ticket de la reserva.
function renderizarTicket(){
    // 1. Lee lo que el usuario ha escrito en el formulario.
    const reserva = leerFormulario();

    // 2. Calcula subtotal, descuento y total.
    const resultado = calcularReserva(reserva);

    // Nombre del servicio, o un texto por defecto si no hay ninguno elegido.
    const nombreServicio = resultado.servicio?.name ?? 'Sin seleccionar';

    // Convierte el array de extras en un texto: "Lavado gostoso, Pulido de cejas".
    // map() saca solo el nombre de cada extra; join() los une con comas.
    const nombreExtras = resultado.extrasDetalle
            .map(extra => extra.nombre)
            .join(', ');

}

// Pinta las tarjetas y el <select> al cargar la página.
renderizarServicios();