# Fuentes de diseño

Set curado para las fases 07 a 11 cuando el fundador no trae sus propias
referencias. Sólo lo gratis, más 21st en su plan gratis. Datos medidos el
2026-10-24: precios, licencias y planes cambian; revísalos antes de depender de
uno.

## Por fase

| Fase | Para qué | Fuente | Licencia y modelo | Cómo la usa el motor |
|---|---|---|---|---|
| 07, 10 | Inspiración web | Awwwards | Navegar es gratis; sus términos prohíben el uso no autorizado del contenido | Sólo navegar, una página a la vez. Su robots.txt bloquea la galería y las búsquedas |
| 07, 10 | Inspiración web | Siteinspire, One Page Love, Minimal Gallery | Gratis | Sólo navegar |
| 07 | Color | Realtime Colors | Gratis | A mano; exporta CSS, Tailwind y shadcn en OKLCH |
| 07 | Color | Coolors (plan gratis) | Gratis con límites | A mano |
| 07 | Tipografía | Google Fonts | Por familia, en general OFL o Apache | Se sirven desde el propio dominio (`next/font` o archivos locales), no desde el CDN de Google |
| 07 | Tipografía | Fontshare | Gratis, uso comercial; no permite redistribuir los archivos | Descargar a mano; revisar la licencia de cada familia |
| 07, 10 | Iconos | Lucide (default) | ISC | npm, versión exacta |
| 07, 10 | Iconos | Tabler Icons (alternativa) | MIT | npm, versión exacta |
| 07 | Ilustración | unDraw | Gratis, uso comercial; prohíbe descarga automatizada y uso para IA | **Sólo a mano**, por una persona |
| 07 | Motion decorativo | LottieFiles (animaciones gratis) | Lottie Simple License | Descargar a mano |
| 07 | Motion interactivo | Rive (plan gratis) | Runtimes MIT; el plan gratis pone una pantalla de presentación al exportar | Editor a mano |
| 07 | Logos de terceros | 21st `search_logo` | Gratis; son marcas registradas | Sólo para representar a esa marca, nunca como base de un logo |
| 10, 11 | Base de componentes | shadcn/ui + Base UI | MIT | MCP `shadcn` y su CLI; default del motor |
| 10 | Componentes animados | React Bits (gratis) | MIT + Commons Clause: se usa en el producto, no se redistribuye ni vende | Registry de shadcn, instalado en el repo del proyecto |
| 10 | Componentes animados | Magic UI (gratis) | MIT | Registry `@magicui` |
| 10 | Piezas de app | coss.com/ui (antes Origin UI) | MIT en sus componentes; el resto del repo es AGPL | Registry `@coss`; no copies de `packages/ui` |
| 10 | Primitivos de animación | Motion Primitives | MIT | Registry `@motion-primitives` |
| 10 | Marketplace de componentes | 21st (plan gratis) | Cada componente conserva su licencia y pide crédito al autor; prohíbe scraping y entrenar IA | MCP `21st`: buscar es gratis; **2 descargas de código al día** |
| 10, 11 | Componentes de datos | MUI: Material UI y MUI X Community | MIT | npm + MCP `mui` (docs). **Sólo si el producto lo pide** (tablas o gráficas pesadas): su sistema de estilos choca con Tailwind |
| 11 | Referencia de design system | Untitled UI React (gratis) | MIT en la parte gratis | Como referencia de estructura |
| 07, 11 | Formato `DESIGN.md` | Listas «Awesome Claude Design» (VoltAgent, rohitg00) | MIT, sólo markdown | Se toma el formato de 9 secciones; nunca un `DESIGN.md` que imite una marca real |

## Fuera del set

- **De pago:** Mobbin, Refero, Page Flows, MUI X Pro/Premium, Aceternity Pro,
  Untitled UI PRO, Magic UI Pro, React Bits Pro, Tailwind Plus (además sin altas
  nuevas desde el 9 de septiembre de 2026), Spline de pago.
- **No usar:** `reactbytes.online` (otro proyecto, de 4★, probable derivado de
  React Bits), Joy UI (en pausa), Toolpad (archivado), la API de Huemint (sólo
  uso no comercial), Dribbble por automatización (sus términos prohíben el
  scraping; navegar a mano sí).
- **Aceternity UI gratis:** su licencia de la parte gratis no está clara; no se
  usa hasta confirmarla.

## Restricciones que el motor respeta

1. **Nada de scraping.** En galerías e inspiración (Awwwards, Dribbble,
   Siteinspire, Land-book, Lapa Ninja): sólo navegar una página a la vez, sin
   extraer masivamente ni archivar capturas. Respeta robots.txt y los 403.
2. **Inspirarse no es copiar.** Se extraen principios (jerarquía, ritmo, paleta,
   tipo de layout); nunca un layout, un texto o un asset reconocible.
3. **«No revender».** React Bits, 21st y similares se instalan **en el repo de
   cada proyecto desde su fuente oficial**. Idealas no los empaqueta como kit,
   plantilla o biblioteca propia.
4. **21st:** antes de producción, revisa la licencia de cada componente y da
   crédito visible al autor cuando lo pida.
5. **A mano:** unDraw (descarga) y Huemint (web, no API).
6. **Dependencias del proyecto** con versión exacta y su porqué, incluidas las
   que arrastran los componentes (`motion`, `three`, `ogl`…).
7. **Fuentes y scripts autohospedados** en lo que se publica: nada de Google
   Fonts remoto, CDNs sin `integrity` ni imágenes de `picsum.photos`.
