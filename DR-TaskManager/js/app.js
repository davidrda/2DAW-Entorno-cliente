// Modo estricto: convierte errores silenciosos (p. ej. variables sin declarar) en errores reales
'use strict';


// Atajo para document.querySelector. Devuelve null si no encuentra nada.
// El script se carga con defer, así que el DOM ya existe cuando se ejecuta.
const $ = selector => document.querySelector(selector);

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


let siguienteId = 4;

let busqueda = '';


// Guardará un AbortController, que permite quitar de golpe todos los
// listeners registrados con su misma señal (signal).
// null = seguimiento del puntero desactivado.
let seguimiento = null;


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

  const tareasNoCompletadas = tareas.filter(
    t => t.estado !== 'completada'
  );

  $('#tablero').dispatchEvent(new CustomEvent ( 'tareas:cambiadas', { bubbles: true,

    detail: {
      total: total,
      noCompletadas: tareasNoCompletadas
    }


     }  )    )
}
