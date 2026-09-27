/*
 * MODO ESTRICTO: 'use strict'
 * ============================
 *
 * Activa el "modo estricto" de JavaScript.
 *
 * Este modo hace que JavaScript sea más exigente con ciertos
 * errores que de otra forma podrían pasar desapercibidos.
 *
 * Por ejemplo, ayuda a evitar utilizar accidentalmente variables
 * que no han sido declaradas.
 *
 * Es una buena práctica, especialmente mientras aprendemos.
 */
'use strict';

const nombrePelu = "Peladillos Eladio";

console.log(nombrePelu);

/* Sobre undefined:
 * Declaramos una variable llamada clientesAtendidos.
 *
 * No le estamos dando ningún valor inicialmente.
 *
 * Por tanto, JavaScript le asignará automáticamente:
 *
 * undefined
 *
 * undefined significa que la variable existe,
 * pero todavía no tiene un valor asignado.
 */
let clientesAtendidos;


/*
 * Mostramos el contenido de clientesAtendidos.
 *
 * Resultado:
 *
 * Clientes atendidos: undefined
 */
console.log('Clientes atendidos: ', clientesAtendidos);

clientesAtendidos = 10;

clientesAtendidos = "pepe";

console.log('Clientes atendidos: ', clientesAtendidos);

const precioCorte = 8;
const precioBarba = 8.50;


/*
 * typeof permite saber el tipo de un dato.
 *
 * typeof precioCorte
 *
 * devuelve:
 *
 * "number"
 */
console.log('Precio Corte: ', typeof precioCorte);


/*
 * Aunque precioBarba tenga decimales, también es number.
 *
 * Resultado:
 *
 * Precio Barba: number
 */
console.log('Precio Barba: ', typeof precioBarba);

const nombreCiente = 'Pepe Rodríguez';
const servicio = "Corte y barba";


/*
 * Mostramos los valores.
 */
console.log('nombreCiente: ', nombreCiente);
console.log('servicio: ', servicio);

const tieneCita = true;
const tieneDescuento = false;


/*
 * Mostrará:
 *
 * tieneCita: true
 */
console.log('tieneCita: ', tieneCita);


/*
 * typeof true devuelve:
 *
 * "boolean"
 */
console.log('tieneCita: ', typeof tieneCita);



/*
 * ============================================================
 * UNDEFINED
 * ============================================================
 */

/*
 * Declaramos la variable pero NO le asignamos ningún valor.
 */
let horaCita;


/*
 * Su contenido será:
 *
 * undefined
 */
console.log('horaCita: ', horaCita);


/*
 * Curiosamente, el tipo también será:
 *
 * "undefined"
 */
console.log('horaCita: ', typeof horaCita);



/*
 * ============================================================
 * NULL
 * ============================================================
 */

/*
 * null se utiliza para representar intencionadamente
 * la ausencia de un valor.
 *
 * Aquí estamos indicando que el cliente no tiene
 * un teléfono almacenado.
 *
 * Hay una diferencia conceptual importante:
 *
 * undefined -> todavía no se ha asignado un valor.
 *
 * null -> nosotros hemos indicado explícitamente que
 *         no hay valor.
 */
const telCliente = null;


console.log('telCliente: ', telCliente);


/*
 * Aquí aparece una peculiaridad histórica de JavaScript.
 *
 * Podríamos pensar que:
 *
 * typeof null
 *
 * devolvería:
 *
 * "null"
 *
 * PERO NO.
 *
 * Devuelve:
 *
 * "object"
 *
 * Esto es un comportamiento histórico de JavaScript
 * que se mantiene por compatibilidad.
 */
console.log('telCliente: ', typeof telCliente);

const serviciosDisponibles = [
    'Corte clásico',
    'Carte moderno',
    'Barba'
];


/*
 * Mostramos el array completo.
 */
console.log('Servicios: ', serviciosDisponibles);


/*
 * Aquí encontramos otra característica importante.
 *
 * typeof aplicado a un Array devuelve:
 *
 * "object"
 *
 * NO devuelve "array".
 */
console.log('Servicios: ', typeof serviciosDisponibles);


/*
 * Entonces, ¿cómo podemos comprobar correctamente si algo
 * es un Array?
 *
 * Utilizando:
 *
 * Array.isArray()
 *
 * En este caso devolverá:
 *
 * true
 */
console.log(
    'es un array? : ',
    Array.isArray(serviciosDisponibles)
);



/*
 * ============================================================
 * OBJETOS
 * ============================================================
 *
 * Los objetos permiten agrupar información relacionada.
 */

const cliente = {

    // Propiedad String
    nombre: 'Ana',

    // Propiedad Number
    edad: 30,

    // Propiedad Boolean
    tieneCita: true
};


/*
 * Podemos mostrar el objeto completo.
 */
console.log('Objeto cliente : ', cliente);


/*
 * Para acceder a una propiedad podemos utilizar
 * la notación del punto:
 *
 * objeto.propiedad
 *
 * Por tanto:
 *
 * cliente.nombre
 *
 * devuelve:
 *
 * "Ana"
 */
console.log('Nombre cliente : ', cliente.nombre);


/*
 * typeof aplicado a un objeto devuelve:
 *
 * "object"
 */
console.log('Tipo cliente : ', typeof cliente);



/*
 * ============================================================
 * TIPADO DINÁMICO
 * ============================================================
 *
 * Esta parte demuestra una característica fundamental
 * de JavaScript.
 */

/*
 * Primero dato contiene un número.
 */
let dato = 25;

console.log('Dato : ', dato);

// number
console.log('Tipo Dato : ', typeof dato);


/*
 * Ahora la MISMA variable pasa a contener un String.
 *
 * Esto es válido en JavaScript.
 */
dato = 'Pepe';

console.log('Dato : ', dato);

// string
console.log('Tipo Dato : ', typeof dato);


/*
 * Ahora vuelve a cambiar de tipo.
 *
 * Esta vez contiene un boolean.
 */
dato = true;

console.log('Dato : ', dato);

// boolean
console.log('Tipo Dato : ', typeof dato);


/*
 * Esto demuestra el TIPADO DINÁMICO:
 *
 * dato = 25;       -> number
 *
 * dato = 'Pepe';   -> string
 *
 * dato = true;     -> boolean
 */



/*
 * ============================================================
 * OPERACIONES MATEMÁTICAS Y CONVERSIÓN DE TIPOS
 * ============================================================
 */

const precio1 = 20;
const precio2 = 30;

/*
 * ATENCIÓN:
 *
 * Aunque parece un número, '4' tiene comillas.
 *
 * Por tanto NO es un Number.
 *
 * Es un String.
 */
const precio3 = '4';

console.log('Suma: ', precio1 + precio2);


/*
 * Esta operación es MUY IMPORTANTE:
 *
 * precio1 + precio2 + precio3
 *
 * JavaScript evalúa de izquierda a derecha.
 *
 * Primero:
 *
 * 20 + 30
 *
 * Resultado:
 *
 * 50
 *
 * Después tenemos:
 *
 * 50 + '4'
 *
 * Como '4' es un String, JavaScript convierte el 50 en texto
 * y CONCATENA.
 *
 * Resultado:
 *
 * "504"
 */
console.log('Suma2: ', precio1 + precio2 + precio3);


/*
 * Aquí ocurre algo diferente:
 *
 * precio3 + precio2 + precio1
 *
 * Tenemos:
 *
 * '4' + 30
 *
 * Como el primer valor es un String, se concatena:
 *
 * "430"
 *
 * Después:
 *
 * "430" + 20
 *
 * Resultado:
 *
 * "43020"
 *
 * Por tanto:
 *
 * Suma3: 43020
 */
console.log('Suma3: ', precio3 + precio2 + precio1);

console.log('Multiplica: ', precio1 * precio2);

console.log('Divide: ', precio1 / precio2);

console.log('Módulo: ', precio1 % precio2);


/*
 * Aquí tenemos:
 *
 * 20 % '4'
 *
 * precio3 es un String.
 *
 * Sin embargo, el operador % necesita números.
 *
 * JavaScript intenta convertir automáticamente:
 *
 * '4' -> 4
 *
 * Entonces realiza:
 *
 * 20 % 4
 *
 * Resultado:
 *
 * 0
 */
console.log('Módulo: ', precio1 % precio3);


/*
 * Ocurre algo parecido con la división.
 *
 * 20 / '4'
 *
 * JavaScript convierte:
 *
 * '4' -> 4
 *
 * Resultado:
 *
 * 5
 */
console.log('Divide: ', precio1 / precio3);


/*
 * Y también con la multiplicación:
 *
 * 20 * '4'
 *
 * JavaScript convierte '4' a número.
 *
 * Resultado:
 *
 * 80
 */
console.log('Multiplica: ', precio1 * precio3);



/*
 * ============================================================
 * OPERADORES DE COMPARACIÓN
 * ============================================================
 */

const edad = 20;

console.log(edad == 18);

console.log(edad < 18);

console.log(edad > 18);

console.log(edad <= 18);

console.log(edad >= 18);



/*
 * ============================================================
 * == FRENTE A ===
 * ============================================================
 *
 * Esta diferencia es MUY importante en JavaScript.
 */


/*
 * == comprueba igualdad permitiendo conversión de tipos.
 *
 * === comprueba:
 *
 * 1. Que el valor sea igual.
 * 2. Que el tipo sea igual.
 */
console.log(edad === 18);

console.log(edad < 18);

console.log(edad > 18);