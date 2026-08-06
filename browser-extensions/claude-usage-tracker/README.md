# Claude Usage Tracker

Extensión de navegador (Firefox y Chrome, Manifest V3) que muestra tu **porcentaje
de uso de Claude.ai** directamente en el ícono de la barra de herramientas, sin
tener que entrar a Configuración cada vez.

## Cómo funciona

- Un `alarm` en segundo plano abre periódicamente (por defecto cada 15 minutos)
  una ventana minimizada e invisible apuntando a tu página de uso de claude.ai.
- Un content script lee el `%` de uso desde esa página (busca una barra de
  progreso `role="progressbar"` o texto con `%` cerca de la palabra "uso/límite").
- El resultado se guarda y se muestra como badge en el ícono de la extensión
  (verde <70%, ámbar 70-90%, rojo >90%), sin ninguna acción manual de tu parte.
- Todo el tráfico va directo de tu navegador a `claude.ai` usando tu sesión ya
  iniciada. La extensión no envía datos a ningún servidor de terceros.

## Instalación

### Firefox (temporal, para probar)

1. Abrí `about:debugging#/runtime/this-firefox`
2. "Cargar complemento temporal..."
3. Seleccioná el archivo `manifest.json` de esta carpeta

Se desinstala al cerrar Firefox. Para instalación permanente hay que firmarla
en [addons.mozilla.org](https://addons.mozilla.org) (podés subirla como
"unlisted" para uso personal) usando `web-ext build` + `web-ext sign`.

### Chrome / Edge / Brave

1. Abrí `chrome://extensions`
2. Activá "Modo de desarrollador" (arriba a la derecha)
3. "Cargar descomprimida" → seleccioná esta carpeta

## Configuración

Abrí el popup (click en el ícono) → "Configuración":

- **URL de la página de uso**: por defecto `https://claude.ai/settings/usage`.
  Si tu cuenta muestra el uso en otra ruta (por ejemplo `/settings/billing` o
  algo dentro de la Console de Anthropic), pegá ahí la URL real que ves en tu
  navegador cuando revisás el uso manualmente.
- **Intervalo**: cada cuántos minutos se revisa (mínimo 5).

## Nota sobre los selectores

No tuve forma de inspeccionar en vivo el HTML autenticado real de tu cuenta de
claude.ai para armar esta extensión, así que la detección del `%` es
heurística (busca `role="progressbar"` o texto tipo `72%` cerca de palabras
como "uso"/"límite"). Si al instalar el badge queda en `?` (no encontró el
dato):

1. Abrí manualmente la página de uso, click derecho sobre el número/barra de
   progreso → "Inspeccionar".
2. Copiá el HTML de ese elemento.
3. Ajustá `content-usage.js` (funciones `findPercentFromProgressbars` /
   `findPercentFromText`) con el selector correcto.

## Permisos que pide

- `alarms`, `storage`: programar la revisión periódica y guardar el último
  valor leído.
- `host_permissions` sobre `https://claude.ai/*`: para poder leer el DOM de
  esa página desde el content script.

No pide acceso a otras pestañas ni a tu historial.
