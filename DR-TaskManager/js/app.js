// Modo estricto: convierte errores silenciosos (p. ej. variables sin declarar) en errores reales
'use strict';


// Atajo para document.querySelector. Devuelve null si no encuentra nada.
// El script se carga con defer, así que el DOM ya existe cuando se ejecuta.
const $ = selector => document.querySelector(selector);

// "Base de datos" en memoria: un array de objetos, uno por tarea.
// const no impide modificar el contenido (push, etc.), solo reasignar la variable.
// Si recargas la página, los cambios se pierden (no hay almacenamiento permanente).
const tareas = [

    {
        id: 1,
        titulo: 'Preparar documentación',
        prioridad: 'alta',
        estado: 'pendiente'
    },

    {
        id: 2,
        titulo: 'Revisar página web',
        prioridad: 'media',
        estado: 'en-proceso'
    },

    {
        id: 3,
        titulo: 'Enviar presupuesto',
        prioridad: 'baja',
        estado: 'completada'
    }

];


// Contador para dar un id único a cada tarea nueva (las 3 de arriba ya usan 1, 2 y 3).
// Usa let porque su valor irá cambiando.
let siguienteId = 4;

// Texto que el usuario escribe en el buscador. Se guarda aquí para que
// renderizar() sepa por qué filtrar.
let busqueda = '';


// Guardará un AbortController, que permite quitar de golpe todos los
// listeners registrados con su misma señal (signal).
// null = seguimiento del puntero desactivado.
let seguimiento = null;


// Los estados posibles = las columnas del tablero.
// Cada valor coincide con el id de un elemento del HTML (#pendiente, #en-proceso...),
// por eso renderizar() puede recorrerlos para encontrar cada columna.
const estados = [
    'pendiente',
    'en-proceso',
    'completada'
];

// Único punto por el que se muestran mensajes al usuario
function avisar(texto) {

    $('#mensaje').textContent = texto;

}


// Retrasa fn hasta que pasen ms milisegundos sin nuevas llamadas
// (útil en búsquedas: solo se busca cuando el usuario deja de teclear).
function debounce(fn, ms) {

    // Closure: la función devuelta sigue "viendo" esta variable aunque
    // debounce ya haya terminado. Así recuerda el temporizador anterior
    // entre una llamada y otra.
    let id;

    // ...args recoge todos los argumentos (normalmente el event) en un array
    return (...args) => {

        // Cancela el temporizador pendiente: solo cuenta la última llamada
        clearTimeout(id);

        id = setTimeout(() => fn(...args), ms);

    };

}


// Deja ejecutar fn como máximo una vez cada ms milisegundos.
// Diferencia con debounce: debounce espera a que termine la actividad;
// throttle ejecuta durante la actividad, pero espaciando las llamadas
// (útil en eventos como resize o mousemove).
function throttle(fn, ms) {

    // Instante de la última ejecución (0 = nunca)
    let ultimo = 0;

    return (...args) => {

        // Milisegundos desde 1970 (época Unix)
        const ahora = Date.now();

        // Solo ejecuta si ya pasó el intervalo; el resto de llamadas se ignoran
        if (ahora - ultimo >= ms) {

            ultimo = ahora;

            fn(...args);

        }

    };

}

// Avisa de que la lista cambió mediante un evento personalizado.
// Con bubbles: true el evento sube por el DOM, así que se puede escuchar
// en #tablero o en cualquiera de sus ancestros (document incluido).
// Los datos viajan en event.detail.
function notificarCambio() {

    const total = tareas.length;

    // filter() crea un array nuevo solo con las tareas que cumplen la condición
    // (aquí: las que NO están completadas). El array original no cambia.
    const tareasNoCompletadas = tareas.filter(
    t => t.estado !== 'completada'
    );

    // dispatchEvent "lanza" el evento sobre #tablero, como si el usuario hubiera hecho clic.
    // CustomEvent(nombre, opciones) crea un evento inventado por nosotros.
    $('#tablero').dispatchEvent(new CustomEvent ( 'tareas:cambiadas', {

        // Hace que el evento suba hacia los elementos padre (hasta document)
        bubbles: true,

        // Datos extra que recibirá quien escuche el evento (en event.detail)
        detail: {
            total: total,
            noCompletadas: tareasNoCompletadas.length
        }
    }))
}

// Escucha en document: como el evento sube (bubbles), llega hasta aquí
// aunque se lance desde #tablero. Por ahora solo muestra los datos en la consola.
document.addEventListener('tareas:cambiadas', event => {

    console.log('evento recibido: ', event.type);
    console.log('detalles: ', event.detail);


});

// Dibuja las tareas en pantalla. Se vuelve a llamar cada vez que algo cambia:
// primero vacía las columnas y luego las rellena desde cero con el array tareas.
function renderizar(){

    // replaceChildren() sin argumentos borra todo lo que hay dentro del elemento.
    // Así evitamos que las tarjetas se dupliquen al renderizar de nuevo.
    for (const estado of estados){
        $('#' + estado).replaceChildren();
    }

    // Valor elegido en el desplegable de prioridad ('todas', 'alta', 'media'...)
    const filtro = $('#filtro').value;

    for (const tarea of tareas) {

        // Si hay un filtro activo y la prioridad no coincide, salta a la siguiente tarea.
        // continue = "termina esta vuelta del bucle y pasa a la siguiente".
        if ( filtro !== 'todas' && tarea.prioridad !== filtro) {
            continue;
        }

        // Pasa título y búsqueda a minúsculas para no distinguir mayúsculas.
        // includes() comprueba si el título contiene el texto buscado.
        // Si NO lo contiene (!), la tarea se salta.
        if (
            !tarea.titulo
               .toLocaleLowerCase()
               .includes(busqueda)
        ) {
            continue;
        }


       // createElement crea el elemento en memoria; aún no se ve en la página
       const tarjeta = document.createElement('article');



       tarjeta.className= 'tarea';
       // <article class="tarea"></article>

       // dataset guarda datos en atributos data-* del HTML.
       // Sirven para saber luego qué tarea es esta tarjeta (p. ej. al hacer clic).
       tarjeta.dataset.id = tarea.id;
       tarjeta.dataset.prioridad = tarea.prioridad; 
       // <article class="tarea" data-id="1" data-prioridad="media">
       // <h4>Comprar mortadela</h4>
       //</article>

       const titulo = document.createElement('h4');
       //<h4>Comprar mortadela</h4>
       // textContent inserta texto plano (no HTML): es seguro frente a inyección de código (XSS)
       titulo.textContent = tarea.titulo;

       // append mete el h4 dentro del article
       tarjeta.append(titulo);
       // <article class="tarea" data-id="1" data-prioridad="media">
       // <h4>Comprar mortadela</h4>
       //</article>

       const detalle = document.createElement('small');
       detalle.textContent = 'Prioridad: ' + tarea.prioridad;

       // append admite varios elementos a la vez: el texto y un salto de línea (<br>)
       tarjeta.append(detalle, document.createElement('br'));

     




    }

}
