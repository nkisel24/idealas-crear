# Fase 07 · Identidad de marca

## Para qué
Darle al producto todo lo que una marca necesita para verse y sonar como una
sola cosa: estrategia, voz, logo, color, tipografía, iconos, imagen, movimiento
y aplicaciones. Cierra con un `DESIGN.md` que es el contrato hacia el design
system (fase 11).

## Entra
- `.idealas/fases/00-arranque/ficha.md` (si ya trae marca, esta fase la
  documenta en vez de crearla)
- `.idealas/fases/01-idea/idea.md`, `02-mercado/competencia.md`
- `.idealas/fases/06-nombre/decision.md`

## El plan que presentas
`.idealas/fases/07-marca/plan.md`:

```markdown
# Plan · Marca
- Estrategia: posicionamiento, personalidad (3–5 rasgos), contra quién se distingue
- Voz y tono: cómo habla, qué nunca dice, ejemplos
- Logo: <n> conceptos → checkpoint → kit
- Paleta: claro y oscuro, contraste AA medido
- Tipografía: familias con licencia y su uso
- Iconos, imagen, motion, aplicaciones (favicon, OG, redes)
- Lo que sale: estrategia.md, voz.md, logo/, paleta.md, tipografia.md, guia.md, DESIGN.md
```

Puedes partir la fase en dos aprobaciones: (a) estrategia y voz, (b) lo visual.

## Pasos
1. **Estrategia.** Posicionamiento en una frase, personalidad en 3–5 rasgos con
   su contrario («cercana, no informal»), y en qué se distingue visualmente de
   cada competidor de la fase 02.
2. **Voz y tono.** Cómo habla (tuteo o usted, largo de frase, humor sí/no),
   palabras que usa y que nunca usa, y 5 ejemplos reales (botón, error, correo,
   vacío, éxito). `idealas:product-marketing` y `idealas:copywriting`.
3. **Inspiración.** Navega Awwwards, Siteinspire u One Page Love **una página a
   la vez** para extraer principios (jerarquía, ritmo, paleta), nunca para
   copiar un layout. Usa `idealas:brandkit` y `idealas:high-end-visual-design`
   como dirección de arte; `design-taste-frontend-v1` como alternativa.
4. **Logo** con `idealas:logo-design`. Respeta su **checkpoint de conceptos**:
   presenta los conceptos y espera aprobación antes de armar el kit. Antes de
   entregar, compara el logo elegido contra los de la competencia y contra lo
   encontrado en IMPI (fase 06): si se parece, se cambia. Si hay un boceto en
   imagen, `image_vectorize` de Adobe (si está) lo pasa a SVG.
5. **Paleta.** Define tokens de color para claro y oscuro (fondo, superficie,
   texto, texto secundario, acento, estados). **Mide** el contraste WCAG de cada
   par texto/fondo con un cálculo de luminancia relativa (script o fórmula), no
   a ojo: texto normal ≥ 4.5:1, texto grande y componentes ≥ 3:1. Deja la tabla
   con los valores medidos. Realtime Colors y Coolors sirven para explorar a
   mano.
6. **Tipografía.** Máximo dos familias (más una mono si hace falta). Revisa la
   licencia de cada una (Google Fonts: OFL o Apache; Fontshare: su licencia,
   que no permite redistribuir los archivos). Se sirven desde el propio dominio,
   no desde un CDN de terceros. `font_recommend` de Adobe ayuda si está.
7. **Aprobación interactiva.** Con el plugin `playground`, arma un explorador con
   controles de paleta y tipografía para que el usuario apruebe moviendo
   controles, no leyendo hex.
8. **Iconos** (Lucide por default; Tabler si faltan), **imagen** (fotografía o
   ilustración: unDraw sólo descargada a mano), **motion** (2–3 principios con
   duraciones; `idealas:apple-design`, `idealas:emil-design-eng`,
   `idealas:design-motion-principles`), y **aplicaciones**: favicon, imagen OG
   1200×630, avatar de redes.
9. **Guía de marca** y **`DESIGN.md`** con 9 secciones: atmósfera; paleta y
   roles; tipografía; componentes; layout; profundidad y elevación; hacer / no
   hacer; responsive; guía para prompts (cómo pedirle a un agente que diseñe en
   esta marca). Es el contrato que lee la fase 11.

## Herramientas
- `idealas:logo-design`, `idealas:brandkit`, `idealas:high-end-visual-design`,
  `idealas:minimalist-ui`, `idealas:apple-design`, `idealas:emil-design-eng`,
  `idealas:design-motion-principles`, `idealas:copywriting`,
  `idealas:product-marketing`.
- Plugin `playground` para aprobar paleta y tipografía.
- MCP `21st`: `search_logo` es gratis, pero los logos de terceros son marcas
  registradas: sólo para representar a esa marca, nunca como base del logo.
- Adobe (`image_vectorize`, `font_recommend`, `extract_brand`) si está.
- Ver `fuentes-diseno.md` para el set curado y sus licencias.

## Sale
- `.idealas/fases/07-marca/estrategia.md`
- `.idealas/fases/07-marca/voz.md`
- `.idealas/fases/07-marca/logo/`: SVG (horizontal, vertical, símbolo, una tinta,
  negativo), PNG de favicon e íconos, y `conceptos.md`.
- `.idealas/fases/07-marca/paleta.md`: tokens claro/oscuro y tabla de contraste medido.
- `.idealas/fases/07-marca/tipografia.md`: familias, pesos, escala y licencias.
- `.idealas/fases/07-marca/guia.md`: iconos, imagen, motion, aplicaciones.
- `.idealas/fases/07-marca/DESIGN.md`: las 9 secciones.

## Listo cuando
- Cada par de texto y fondo de la paleta tiene su contraste medido y pasa AA en
  claro y oscuro.
- El logo funciona a 16 px, a una tinta y en negativo.
- Cada fuente tiene su licencia anotada.
- El usuario aprobó conceptos de logo y, después, el kit.

## Trampas
- Copiar la estética de una marca real (los `DESIGN.md` «inspirados en Stripe»
  de las listas públicas) es un problema de marca registrada, no inspiración.
- Una paleta bonita que no pasa contraste no sirve: se ajusta el tono, no se
  ignora el número.
- Las skills de imagen (`brandkit`, `imagegen-*`) piden generar imágenes; sin
  una herramienta de generación conectada, usa su dirección de arte.
- No subas el brief del fundador con datos personales a ningún servicio.
