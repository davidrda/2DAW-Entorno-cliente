// Modo estricto: JavaScript es más exigente (p. ej. error si usas una variable sin declarar)
'use strict';

// ---------- TIPOS BÁSICOS ----------

const nombrePelu = "Peladillos Eladio";

console.log(nombrePelu);

// Sin valor inicial, la variable vale undefined
let clientesAtendidos;

console.log('Clientes atendidos: ', clientesAtendidos);

// let permite cambiar el valor, incluso a otro tipo
clientesAtendidos = 10;

clientesAtendidos = "pepe";

console.log('Clientes atendidos: ', clientesAtendidos);

const precioCorte = 8;
const precioBarba = 8.50;

// typeof devuelve el tipo como texto; enteros y decimales son ambos "number"
console.log('Precio Corte: ', typeof precioCorte);

console.log('Precio Barba: ', typeof precioBarba);

const nombreCiente = 'Pepe Rodríguez';
const servicio = "Corte y barba";

console.log('nombreCiente: ', nombreCiente);
console.log('servicio: ', servicio);

const tieneCita = true;
const tieneDescuento = false;

console.log('tieneCita: ', tieneCita);

// "boolean"
console.log('tieneCita: ', typeof tieneCita);


// ---------- UNDEFINED ----------

let horaCita;

console.log('horaCita: ', horaCita);

// "undefined"
console.log('horaCita: ', typeof horaCita);


// ---------- NULL ----------

// null = ausencia de valor puesta A PROPÓSITO (undefined = aún no se ha asignado nada)
const telCliente = null;

console.log('telCliente: ', telCliente);

// ⚠️ Rareza histórica: typeof null devuelve "object" (no "null"), se mantiene por compatibilidad
console.log('telCliente: ', typeof telCliente);


// ---------- ARRAYS ----------

const serviciosDisponibles = [
    'Corte clásico',
    'Carte moderno',
    'Barba'
];

console.log('Servicios: ', serviciosDisponibles);

// ⚠️ typeof de un array devuelve "object", no "array"
console.log('Servicios: ', typeof serviciosDisponibles);

// Forma correcta de comprobar si algo es un array
console.log(
    'es un array? : ',
    Array.isArray(serviciosDisponibles)
);


// ---------- OBJETOS ----------

// Un objeto agrupa datos relacionados en pares propiedad: valor
const cliente = {

    nombre: 'Ana',

    edad: 30,

    tieneCita: true
};

console.log('Objeto cliente : ', cliente);

// Notación del punto: objeto.propiedad
console.log('Nombre cliente : ', cliente.nombre);

console.log('Tipo cliente : ', typeof cliente);


// ---------- TIPADO DINÁMICO ----------

// La variable no tiene tipo fijo: el tipo lo marca el valor que contiene en cada momento
let dato = 25;

console.log('Dato : ', dato);

// number
console.log('Tipo Dato : ', typeof dato);

dato = 'Pepe';

console.log('Dato : ', dato);

// string
console.log('Tipo Dato : ', typeof dato);

dato = true;

console.log('Dato : ', dato);

// boolean
console.log('Tipo Dato : ', typeof dato);


// ---------- OPERACIONES Y CONVERSIÓN DE TIPOS ----------

const precio1 = 20;
const precio2 = 30;

// ⚠️ Con comillas es un String, no un Number
const precio3 = '4';

console.log('Suma: ', precio1 + precio2);

// 20 + 30 + '4' -> se evalúa de izquierda a derecha:
// primero 20 + 30 = 50 (números) y luego 50 + '4': al haber un String, + CONCATENA -> "504"
console.log('Suma2: ', precio1 + precio2 + precio3);

// '4' + 30 + 20 -> empieza con un String, así que concatena desde el principio:
// "430" y luego "43020". El ORDEN de los operandos cambia el resultado.
console.log('Suma3: ', precio3 + precio2 + precio1);

console.log('Multiplica: ', precio1 * precio2);

console.log('Divide: ', precio1 / precio2);

console.log('Módulo: ', precio1 % precio2);

// A diferencia de +, los operadores % / * convierten el String a número: 20 % '4' -> 20 % 4 = 0
console.log('Módulo: ', precio1 % precio3);

// 20 / '4' -> 5
console.log('Divide: ', precio1 / precio3);

// 20 * '4' -> 80
console.log('Multiplica: ', precio1 * precio3);


// ---------- OPERADORES DE COMPARACIÓN ----------

const edad = 20;

console.log(edad == 18);

console.log(edad < 18);

console.log(edad > 18);

console.log(edad <= 18);

console.log(edad >= 18);


// ---------- == FRENTE A === ----------

// == compara permitiendo conversión de tipos (20 == '20' es true).
// === compara valor Y tipo (20 === '20' es false). 💡 Usa === por defecto.
console.log(edad === 18);

console.log(edad < 18);

console.log(edad > 18);
