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
    let optionHtml = '';

    for (const servicio of SERVICIOS) {

        // += AÑADE al texto anterior (con = se perdería la tarjeta previa).
        // Los template literals (` `) permiten varias líneas y ${expresión}.
        cardsHtml += `
          <article class="article">

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

    
    // ==================================================================
    // PASO 3. EXTRAS
    // reserva.extras es un array de claves de EXTRAS: ['lavado', 'cejas']
    // ==================================================================

    // ACTIVIDAD 1: recorre reserva.extras con for...of.
    //   - ¿Qué variable representa cada extra seleccionado?
    //   - ¿Cuántas vueltas da con dos extras? ¿Y con el array vacío?

    // ACTIVIDAD 2: dentro del bucle, obtén el objeto del extra.
    //   PISTA: para usar el contenido de una variable como clave, corchetes:
    //          const clave = 'lavado'; EXTRAS[clave]
    //   - ¿Por qué no sirve EXTRAS.clave?

    // ACTIVIDAD 3: comprueba que el extra existe antes de sumarlo.
    //   PISTA: EXTRAS['inexistente'] devuelve undefined.

    // ACTIVIDAD 4: si existe, súmalo a subtotal.
    //   PISTA: let total = 10; total += 5;  // 15
    //   - ¿Qué propiedad del extra guarda el precio?
    //
    // COMPROBACIÓN: servicio 12 € + lavado 100 € + cejas 3 € = 115 €.
    //               Sin extras = 12 €.

    // ESCRIBE AQUÍ EL CÓDIGO DE LAS ACTIVIDADES 1, 2, 3 Y 4.

    for (const extra of reserva.extras) {

        const datosExtra = EXTRAS[extra];

        if(datosExtra) {
            subtotal += datosExtra.precio;
        }
    }




    // ==================================================================
    // PASO 4. DESCUENTOS
    // DESCUENTO_MIEMBROS = 0.05 | CUPON_DESCUENTO = 0.10 | CODIGO_CUPON
    // ==================================================================

    // ACTIVIDAD 5: declara la variable del porcentaje total de descuento.
    //   - ¿Qué valor inicial? ¿let o const? ¿Por qué?

    // ACTIVIDAD 6: si reserva.esMiembro (booleano), suma DESCUENTO_MIEMBROS.
    //   - ¿Qué estructura condicional usarías?

    // ACTIVIDAD 7: si reserva.coupon === CODIGO_CUPON, suma CUPON_DESCUENTO.
    //   El cupón ya viene normalizado (trim + toUpperCase) desde
    //   leerFormulario(), así que basta con ===.
    //
    // CRITERIO: los descuentos se SUMAN (5 % + 10 % = 15 %).
    //           No se aplica uno y luego otro sobre el resultado reducido.

    // ESCRIBE AQUÍ EL CÓDIGO DE LAS ACTIVIDADES 5, 6 Y 7.

    let porcentajeTotal = 0;

    if(reserva.esMiembro){
        porcentajeTotal += DESCUENTO_MIEMBROS;
    }

    if(reserva.coupon === CODIGO_CUPON){
        porcentajeTotal += CUPON_DESCUENTO;
    }



    // ==================================================================
    // PASO 5. IMPORTE DEL DESCUENTO
    // ==================================================================

    // ACTIVIDAD 8: calcula cuántos euros supone el porcentaje.
    //   Ejemplo: subtotal 100 y porcentaje 0.15 -> 15 €.
    //   PISTA: porcentaje de una cantidad = cantidad * porcentaje.
    //   Guárdalo en una constante.

    // ESCRIBE AQUÍ TU CÓDIGO.
    const descuento = subtotal * porcentajeTotal;



    // ==================================================================
    // PASO 6. PRECIO FINAL
    // ==================================================================

    // ACTIVIDAD 9: calcula lo que paga el cliente.
    //   Ejemplo: subtotal 100 € - descuento 15 € = 85 €.
    //   Guárdalo en una constante llamada total.

    // ESCRIBE AQUÍ TU CÓDIGO.
    const total = subtotal - descuento;



    // ==================================================================
    // PASO 7. DEVOLVER RESULTADOS
    // ==================================================================

    // ACTIVIDAD 10: devuelve un objeto con subtotal, descuento y total.
    //   Añade también servicio para poder mostrar su nombre en el resumen.
    //   - ¿Qué palabra reservada devuelve un valor?
    //   - ¿Cómo se crea un objeto literal? ¿Y con la sintaxis abreviada?
    //   OBJETIVO: const resultado = calcularReserva(reserva);
    //             resultado.subtotal / resultado.descuento / resultado.total

    // ESCRIBE AQUÍ EL RETURN.

    return {
        subtotal,
        descuento,
        total,
        servicio
    };

}
