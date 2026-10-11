# ✂ Peladillos Eladio

Proyecto didáctico de **JavaScript** (Entorno Cliente, 2º DAW): una web de barbería donde se reservan servicios y se calcula el total. Sirve para practicar variables, objetos, arrays, funciones, bucles, formularios y manipulación del DOM.

> ⚠️ **Estado:** en desarrollo. HTML/CSS completos; en `app.js` las funciones están escritas, pero **todavía no se llama a ninguna** y `calcularReserva()` es un ejercicio sin resolver (ver [Pendiente](#-pendiente)).

## 🚀 Cómo ejecutarlo

No necesita instalación ni servidor:

1. Abre `index.html` en el navegador.
2. Abre la consola (`Cmd + Opt + J` en Chrome/Mac) para ver mensajes y errores.

`appRepaso.js` no usa el DOM, se prueba con Node:

```bash
node appRepaso.js
```

## 📁 Estructura

```
DR-Peladios-Eladio/
├── index.html      # Estructura de la página
├── styles.css      # Estilos y diseño responsive
├── app.js          # Lógica: datos + funciones + DOM
├── appRepaso.js    # Apuntes de repaso de fundamentos (solo consola)
└── README.md
```

## 🔄 Flujo de la aplicación

```
DATOS (TIENDA, SERVICIOS, EXTRAS, descuentos)
        │
        ▼
leerFormulario()  ──►  validarReserva()  ──►  calcularReserva()
 (lee y tipa)           (array de errores)     (subtotal, descuento, total)
        │
        ▼
renderizarServicios()  ──►  HTML visible en el navegador
```

## 📄 Qué hace cada archivo

### `index.html`

Carga `app.js` con `defer` (se ejecuta cuando el HTML ya está leído, así los elementos existen).

| Sección | id | Contenido |
|---|---|---|
| Cabecera | `inicio` | Navegación, título y tarjeta de estado |
| Servicios | `servicios` | `#servicesGrid`, donde JS pinta las tarjetas |
| Reserva | `reserva` | Formulario `#bookingForm` y resumen `#ticketContent` |
| Laboratorio JS | `laboratorio` | Botones `data-demo` y consola `#consoleOutput` |

Campos del formulario (`FormData` los lee por su **`name`**, no por `id`):

| `name` | Campo | Tipo que llega a JS |
|---|---|---|
| `clientName` | Nombre | texto |
| `service` | Servicio (`#serviceSelect`) | texto (el `id` del servicio) |
| `age` | Edad | texto → hay que pasarlo a número |
| `day` | Día | texto |
| `extras` | Checkboxes lavado / cejas | varios valores → `getAll()` |
| `coupon` | Código de descuento | texto |
| `member` | Casilla de socio | `'on'` si está marcada, `null` si no |

### `styles.css`

Variables y base (`:root`), hero y navegación, secciones y tarjetas (`.card`), formulario y ticket, laboratorio/consola, footer y *responsive* (`@media (max-width: 780px)`).

### `app.js`

**Datos**

| Constante | Tipo | Qué guarda |
|---|---|---|
| `TIENDA` | Objeto | Nombre, divisa (`EUR`), idioma (`es-ES`) y edad mínima (16) |
| `SERVICIOS` | Array de objetos | `id`, `name`, `precio` y `duracion` (min) |
| `EXTRAS` | Objeto de objetos | `lavado` y `cejas`, cada uno con `nombre` y `precio` |
| `DESCUENTO_MIEMBROS` | Número | `0.05` → 5 % para socios |
| `CODIGO_CUPON` | String | `ELADIO10` |
| `CUPON_DESCUENTO` | Número | `0.10` → 10 % con el cupón |

**Referencias al DOM:** `servicesGrid`, `serviceSelect`, `bookingForm`, `ticketContent`, `formMessage`.

**Funciones**

| Función | Recibe | Devuelve | Qué hace |
|---|---|---|---|
| `formatMoney(importe)` | Número | String | Formato moneda con `Intl.NumberFormat` (`10` → `"10,00 €"`) |
| `escapeHtml(value)` | Cualquier valor | String | Sustituye `& < > " '` por entidades HTML (evita XSS). `&` va **primero** a propósito |
| `buscarServicio(id)` | String | Objeto o `undefined` | Busca en `SERVICIOS` con `find()` |
| `renderizarServicios()` | — | — | Pinta tarjetas y `<option>`s construyendo texto HTML + `innerHTML` |
| `renderizarServiciosCreate()` | — | — | Lo mismo con `createElement` / `textContent` / `append` (más seguro) |
| `leerFormulario()` | — | Objeto | Lee con `FormData` y devuelve `{ nombre, edad, servicioId, dia, extras, coupon, esMiembro }` |
| `validarReserva(reserva)` | Objeto | Array de strings | Lista de **todos** los errores; `[]` si es válida |
| `calcularReserva(reserva)` | Objeto | — (ejercicio) | Debe devolver `{ subtotal, descuento, total, servicio }` |

**Conceptos difíciles, dónde verlos**

| Concepto | Dónde |
|---|---|
| `??` (solo sustituye `null`/`undefined`, no `''` ni `0`) | `leerFormulario()` |
| Texto vs número: `'25' + 1` → `'251'` | `leerFormulario()` (`edad`) |
| `get()` vs `getAll()` | `leerFormulario()` (`extras`) |
| Checkbox → `'on'` / `null` | `leerFormulario()` (`esMiembro`) |
| `NaN !== NaN` → `Number.isNaN()` | `validarReserva()` |
| `textContent` vs `innerHTML` | `renderizarServiciosCreate()` |
| `EXTRAS[clave]` vs `EXTRAS.clave` | `calcularReserva()` (actividad 2) |

### 📝 `calcularReserva()`: ejercicio

Las actividades están como comentarios dentro de la función; el código va debajo de cada bloque.

| Paso | Actividades | Qué hay que hacer |
|---|---|---|
| 3 | 1–4 | Recorrer `reserva.extras` y sumar el precio de cada extra que exista |
| 4 | 5–7 | Porcentaje de descuento (socio 5 % + cupón 10 %, **se suman**) |
| 5 | 8 | Importe del descuento = `subtotal * porcentaje` |
| 6 | 9 | `total = subtotal - descuento` |
| 7 | 10 | `return { subtotal, descuento, total, servicio }` |

Comprobación: servicio `12 €` + lavado `100 €` + cejas `3 €` = **115 €**.

### `appRepaso.js`

Apuntes independientes (no los usa `index.html`); cada bloque imprime un concepto con `console.log`:

- Modo estricto y `let` / `const`
- `undefined` y `null` (y la rareza de `typeof null`)
- Tipos: `number`, `string`, `boolean`, arrays y objetos
- Tipado dinámico
- Operadores aritméticos y conversión automática (`20 + 30 + '4'` → `"504"`)
- `==` frente a `===`

## 📌 Pendiente

- ❌ **No se llama a ninguna función:** `renderizarServicios()`, el envío del formulario, etc. Por eso la página aún no muestra servicios.
- ❌ `calcularReserva()` está sin resolver (devuelve `undefined`).
- ⚠️ `renderizarServicios()` usa la clase `article`, que **no existe en el CSS**; la que da estilo es `card` (la usa la versión `Create`).
- ⚠️ `renderizarServiciosCreate()` usa `append` sin vaciar `servicesGrid`: si se llama dos veces, duplica las tarjetas.
- ⚠️ **Datos inconsistentes:** el lavado cuesta `100` en `EXTRAS` pero `+4 €` en el HTML (y allí se llama "Lavado premium", en JS "Lavado gostoso").
- ⚠️ Los `id` de `SERVICIOS` (`'Tupper fade'`, `'Brocoli'`) llevan espacios/mayúsculas; mejor `'fade'`, `'brocoli'`.
- ⚠️ Los botones del Laboratorio (`data-demo`) no tienen lógica.
- ⚠️ `'use strict'` está repetido al inicio de `app.js` (una vez basta).
- 💡 Si algún día `innerHTML` recibe texto del usuario (p. ej. el nombre), pásalo antes por `escapeHtml()`.
