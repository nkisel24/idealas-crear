# Herramientas del motor

Todo lo que trae el plugin `idealas` o que el motor espera encontrar. Las skills
del plugin se invocan con prefijo `idealas:`. Auditoría y versiones fijadas: en
`vendor/` del plugin.

## Skills

| Herramienta | Tipo | Fases | Cuidado |
|---|---|---|---|
| grill-me, to-spec | skill (mattpocock) | 00, 01, 05 | — |
| brainstorming, writing-plans | skill (superpowers) | 01, 05, 14 | Sólo estas dos, sin el hook del plugin original. **No uses su «visual companion»**: levanta un servidor local y carga un logo de un tercero que funciona como telemetría. Sus rutas de documentos las manda el orquestador (`.idealas/fases/…`), no las suyas |
| customer-research, competitor-profiling, pricing | skill (marketingskills) | 02, 03, 04 | — |
| copywriting, copy-editing, product-marketing | skill (marketingskills) | 06, 07, 16 | — |
| launch, seo-audit, schema, site-architecture, aso | skill (marketingskills) | 08, 16, 17 | — |
| logo-design | skill (kaankiziltug, variante lite) | 07 | Respeta su checkpoint de conceptos; compara contra competencia e IMPI antes de entregar |
| brandkit, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, stitch-design-taste, gpt-taste, image-to-code, imagegen-frontend-web, imagegen-frontend-mobile, redesign-existing-projects, design-taste-frontend-v1 | skill (taste v1) | 07, 09, 10 | Las de imagen piden generar imágenes: sin herramienta de generación, sólo dirección de arte. `gpt-taste` simula aleatoriedad, no corre Python. `image-to-code` está escrita para Codex |
| full-output-enforcement | skill (taste v1) | 14 | Sólo para pedir un archivo completo; no cambia el estilo de las respuestas |
| design-taste-frontend | skill (taste v2) | 09, 10, 15 | `inspect.mjs` levanta un servidor local que sirve la carpeta: córrelo fuera de carpetas con `.env`. `assets.mjs` manda la búsqueda a 6 APIs públicas: avisa. Escribe historial en `~/.taste-skill/` |
| ui-ux-pro-max | skill (núcleo) | 07, 09, 11 | Sin la skill `design` del plugin completo (manda prompts a APIs de imagen con llave) |
| design-motion-principles | skill (kylezantos) | 07, 11, 15 | El modo auditoría escribe `motion-audits/` y abre el navegador |
| animate, animation-performance, animation-vocabulary, apple-design, ask-sonner, break-ui, emil-design-eng, find-animation-opportunities, improve-animations, mobile-native, pick-ui-library, prototype, review-animations | skill (Emil Kowalski) | 07, 09, 10, 14, 15 | `pick-ui-library` recomienda librerías: cada una pasa por justificación y versión exacta |
| animate-expo, write-swift | skill (Emil Kowalski) | 14 | Sólo si el producto es móvil |
| brag-slim | skill (latent-spaces/brag) | 16 | Datos demo, revisión humana antes de publicar, crédito de la música (CC BY 4.0) |
| supabase, supabase-postgres-best-practices | skill (supabase/agent-skills) | 12, 14 | — |
| agentic-actions-auditor, supply-chain-risk-auditor, differential-review | skill (trailofbits) | 15 | Licencia CC-BY-SA-4.0. supply-chain-risk-auditor manda nombres de paquetes a registros públicos y lee `gh auth token`. differential-review delega los cambios de alto riesgo en un agente que no viene: hazlo tú en la conversación |
| modern-web-guidance, chrome-extensions | skill (Google Chrome) | 12 | `chrome-extensions` sólo si el producto es una extensión de Chrome |
| web-design-guidelines | skill (vercel-labs, copia fijada) | 12, 15 | Parcheada para leer sus reglas locales (fijadas a `web-interface-guidelines@434b7f9`), no la URL de `main`. El repo de origen no trae LICENSE; el README la declara MIT |

## Plugins oficiales (dependencias)

| Herramienta | Tipo | Fases | Cuidado |
|---|---|---|---|
| claude-security | plugin (Anthropic) | 15 | Telemetría de conteos (`DISABLE_TELEMETRY=1`); escribe `CLAUDE-SECURITY-<fecha>/` |
| playground | plugin (Anthropic) | 07 | — |
| security-guidance | plugin (Anthropic) | todas | Manda el diff a la API de Anthropic al cerrar el turno y en cada commit: cuidado si hay datos personales en el código |

## MCPs

| Herramienta | Tipo | Fases | Cuidado |
|---|---|---|---|
| playwright | MCP del plugin | 06, 14, 15, 17 | — |
| shadcn | MCP del plugin | 10, 11, 14 | — |
| agentation | MCP del plugin | 10, 14, 15 | Intercepta clics en el navegador de Playwright |
| chrome-devtools | MCP del plugin | 12, 15, 16, 17 | Con `--no-usage-statistics --no-performance-crux` |
| exa | MCP del plugin (remoto) | 02, 13 | La consulta va a Exa: nunca datos personales |
| next-devtools | MCP del plugin | 12, 14 | Telemetría apagada (`NEXT_TELEMETRY_DISABLED=1`) |
| mui | MCP del plugin | 10, 11, 14 | Sólo documentación |
| excalidraw | MCP del plugin (remoto) | 08, 09 | El diagrama viaja a excalidraw: sin datos personales |
| 21st | MCP de usuario (llave personal) | 07, 10, 14 | Plan gratis: 2 descargas de código al día; buscar y `search_logo` gratis |
| context7 | MCP de usuario | 12, 14 | — |
| GoDaddy | conector de claude.ai | 06 | Si está; confirmar que cubre `.mx` |
| Adobe (`image_vectorize`, `font_recommend`, `extract_brand`) | conector de claude.ai | 07 | Si está |

## Fuera, y por qué

| Herramienta | Por qué no entra |
|---|---|
| `morluto/rea` | Es ingeniería inversa de binarios y apps, no diseño. Instalador `curl \| bash`, reescribe la configuración de los agentes, y descompilar la app de un competidor es riesgo legal |
| Desktop Commander | Sus herramientas saltan los `deny` de Claude Code, por default tiene acceso a todo el disco y telemetría encendida, y el modelo puede cambiar su configuración. Está negado en los permisos del equipo |
| brag (completa) | Corre `npx hyperframes` sin versión fija y con telemetría encendida. Entra `brag-slim` |
| last30days | Útil para la voz del cliente, pero sus scripts no están auditados |
| De pago | Mobbin, Refero, MUI X Pro, Recraft, Aceternity Pro, Untitled UI PRO, 21st Builder, Firecrawl en la nube |
| Autohospedar (Firecrawl, Penpot, Umami) | Son gratis, pero correrlos en la VM es una decisión de infraestructura de Nathan y Daniel |
| Artemis | Sin identificar: el candidato más probable (`google/artemis`) sólo sirve para probar apps Android y su instalador escribe configuración global |
| superpowers (plugin completo) | Trae un hook `SessionStart` y TDD forzado; sólo se portaron dos skills |
| insecure-defaults (Trail of Bits) | No es una skill: es un comando que lanza varios agentes con la herramienta Workflow. Si se quiere, entra como plugin aparte |
| Agente `adversarial-modeler` de differential-review | No se copió; la skill lo pide para cambios de alto riesgo. Ese paso lo haces tú en la conversación |
