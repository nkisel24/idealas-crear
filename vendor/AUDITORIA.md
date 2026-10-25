# Auditoría de las skills de terceros

> **Fecha:** 2026-10-24. **Quién:** Claude (fork «vendor»), en la sesión de Nathan.
> **Qué es:** las 55 skills de terceros copiadas en `skills/`, cada una fijada
> a un commit. `vendor/vendor.lock.json` guarda el sha256 de cada archivo y
> `node scripts/vendor.mjs verificar` falla si uno cambia, falta o sobra.
> **Cómo se auditó:** de superficie, no línea por línea. Se revisaron tipos de
> archivo, scripts, hooks, `allowed-tools`, red y hosts,
> `subprocess`/`child_process`/`eval`, variables de entorno y escrituras fuera
> del proyecto. Nada de lo descargado se ejecutó. Los clones se hicieron con
> `core.autocrlf=false`, así que los bytes son los del repo, con LF.

## Cómo se actualiza una fuente

1. Clona la fuente a una carpeta nueva y haz checkout del commit nuevo.
2. Revisa el diff contra el commit del lock con la misma auditoría de abajo.
3. Copia, recalcula los sha256 y actualiza el lock y esta página en el mismo
   PR. Si `verificar` falla sin que hayas tocado nada, alguien cambió una skill
   a mano: eso no se arregla regenerando el lock.

---

## emilkowalski/skill

- **Commit:** `2d228630ba1446365f614a108cb8252f1feda202` · **Licencia:** MIT.
- **Se copió:** las 15. animate, animate-expo, animation-performance,
  animation-vocabulary, apple-design, ask-sonner, break-ui, emil-design-eng,
  find-animation-opportunities, improve-animations, mobile-native,
  pick-ui-library, prototype, review-animations, write-swift.
- **Se dejó fuera:** `performance-cheatsheet.md` de la raíz, que no es
  skill.
- **Riesgo:** sólo markdown. Sin scripts, hooks ni `allowed-tools`.
  `pick-ui-library`, `prototype` y `review-animations` traen
  `disable-model-invocation: true`.
- **Parches:** ninguno.

## Leonxlnx/taste-skill, v1

- **Commit:** `5217fb45be2c0b302f29c9cd31cbd3237501c684` (2026-09-20) ·
  **Licencia:** MIT.
- **Se copió:** las 12. Carpeta de upstream → nombre de la skill:
  - `taste-skill-v1` → `design-taste-frontend-v1`
  - `brandkit` → `brandkit`
  - `soft-skill` → `high-end-visual-design`
  - `minimalist-skill` → `minimalist-ui`
  - `brutalist-skill` → `industrial-brutalist-ui`
  - `stitch-skill` → `stitch-design-taste`
  - `gpt-tasteskill` → `gpt-taste`
  - `image-to-code-skill` → `image-to-code`
  - `imagegen-frontend-web` y `imagegen-frontend-mobile`, sin cambio
  - `redesign-skill` → `redesign-existing-projects`
  - `output-skill` → `full-output-enforcement`
  
  La carpeta destino lleva el `name:` del frontmatter, que no cambia.
- **Se dejó fuera:** la `design-taste-frontend` de v1, porque su lugar lo
  ocupa la v2. También `llms.txt`.
- **Riesgo:** sólo markdown. Los caveats de siempre siguen vigentes (ver
  TOOLING.md): `full-output-enforcement` choca con «reportes concisos»,
  `gpt-taste` simula Python y `image-to-code` está escrita para Codex.
- **Parches:** ninguno.

## Leonxlnx/taste-skill, v2

- **Commit:** `12af471f627f866411b4bd785b19646d3672784c` (v2.1.5) ·
  **Licencia:** MIT.
- **Se copió:** `skills/taste-skill/` completo como
  `skills/design-taste-frontend/`, con scripts, `library/`, `assets/`,
  `evals/` y `references/`. Su frontmatter dice
  `name: design-taste-frontend`: verificado.
- **Se dejó fuera:** `install.sh`, `examples/`, `tests/` y los assets del
  README.
- **Riesgo, medio:**
  - `scripts/lib/cdp.mjs` lanza el Chrome, Edge o Brave ya instalado con
    `--remote-debugging-port=0` y un perfil temporal, y al salir lo mata con
    `taskkill /T /F`.
  - `inspect.mjs` y `scenes.mjs` levantan un servidor en `127.0.0.1` que
    sirve el cwd. Hay que correrlos desde la carpeta del sitio generado, nunca
    desde una raíz con `.env`.
  - `assets.mjs` consulta seis APIs públicas: openverse, wikimedia, artic,
    metmuseum, archive.org y NASA. La consulta, que describe la idea, sale a
    esos terceros.
  - `draw.mjs` escribe `~/.taste-skill/history.json`, fuera del proyecto.
  - Lee estas variables de entorno: `CHROME_PATH`,
    `PUPPETEER_EXECUTABLE_PATH`, `TASTE_SKILL_HISTORY`, `TASTE_SKILL_TMP`,
    `HOME`, `USERPROFILE`, `LOCALAPPDATA` y `PROGRAMFILES`.
  - Lo que genera enlaza `picsum.photos`, Google Fonts, Fontshare y GSAP de
    jsdelivr sin SRI. Antes de publicar: autohospedar.
- **Parches:** ninguno.

## nextlevelbuilder/ui-ux-pro-max-skill

- **Commit:** `d14efff8ed1faa4187f004f79926f428c8074ec7` · **Licencia:** MIT.
- **Se copió:** sólo el núcleo `ui-ux-pro-max`, desde
  `.claude/skills/ui-ux-pro-max/`: SKILL.md, `data/`, `references/` y
  `scripts/` (73 archivos reales, no symlinks).
- **Se dejó fuera:** `banner-design`, `brand`, `design`, `design-system`,
  `slides` y `ui-styling`. La skill `design` manda prompts a Gemini, Atlas
  Cloud y MuAPI con llave.
- **Riesgo:** bajo. Los scripts usan sólo la biblioteca estándar de Python y
  no hacen red. `subprocess` sólo aparece en `scripts/tests/`.
- **Parches:** ninguno.

## kaankiziltug/logo-design-skill

- **Commit:** `734090317a2155c5bf1ae8bd4cc85c6848a0128f` (v1.4.5) ·
  **Licencia:** MIT. El MIT **no cubre** los logos de la biblioteca: ver
  `licencias/kaankiziltug__logo-design-skill.TRADEMARKS.md`.
- **Se copió:** la variante «lite», reproducida desde git. Es el árbol de
  `skills/logo-design` sin ningún `.svg` ni `.png` (1,432) y sin
  `assets/library/gallery.html`. Se comparó archivo por archivo con
  `logo-design-lite.zip` del release v1.4.5: idéntico. Se usó git y no el zip
  porque el zip no está fijado a un commit.
- **Se queda:** `catalog.json`, `classifications.json` y `stats.json`. Son
  metadatos de la biblioteca (nombres y clasificaciones), sin logos.
- **Riesgo:** bajo. Sin red ni llaves. `render_png.py` usa `subprocess` para
  `rsvg-convert`, `inkscape`, `qlmanage` o Chrome headless (perfil temporal,
  sin puerto de depuración). `cairosvg` es opcional; si se instala, que sea
  con versión exacta.
- **Parches:** ninguno.

## kylezantos/design-motion-principles

- **Commit:** `4a9ca879f24a361f4dca4174fe2da0f67b5ddee3` (v2.1.0) ·
  **Licencia:** MIT.
- **Se copió:** la skill completa: 15 archivos, markdown y dos plantillas
  HTML.
- **Riesgo:** muy bajo. Sin código. El modo Audit escribe
  `motion-audits/<proyecto>-<fecha>.html` y lo abre en el navegador; el
  reporte carga Google Fonts.
- **Parches:** ninguno.

## latent-spaces/brag

- **Commit:** `669ab9286aa28b6c3ee30e75f181ee74319d012a` (0.5.0) ·
  **Licencia:** MIT.
- **Se copió:** sólo `brag-slim`, un `SKILL.md`. No trae música ni assets, así
  que no hay aviso CC BY que conservar.
- **Se dejó fuera:** `brag`, la completa. Corre `npx hyperframes` sin versión
  fija y con telemetría a PostHog encendida.
- **Riesgo:** bajo. Con una URL de entrada, la skill baja el sitio en vivo,
  quizá con un navegador headless, y lo que lee puede terminar en un video
  público. Pide preguntar antes de instalar nada.
- **Parches:** ninguno.

## mattpocock/skills

- **Commit:** `5beb35b040e3de97e54fa9e386d7e42d15c295c2` · **Licencia:** MIT.
- **Se copió:** `grill-me` (de `skills/productivity/`) y `to-spec` (de
  `skills/engineering/`).
- **Se dejó fuera:** todo lo demás. Su `prototype` y su `handoff` chocarían de
  nombre con nuestras skills.
- **Riesgo:** sólo markdown.
- **Parches:** ninguno.

## obra/superpowers

- **Commit:** `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` · **Licencia:** MIT.
- **Se copió:** `brainstorming` (con su «visual companion» en `scripts/`) y
  `writing-plans`.
- **Se dejó fuera:** el plugin, su hook `SessionStart` y las demás skills.
- **Riesgo:** medio, y sólo si se usa el visual companion.
  - `scripts/server.cjs` levanta un servidor en `127.0.0.1` por default, con
    token comparado en tiempo constante y cookie `HttpOnly`.
  - `BRAINSTORM_OPEN_CMD` se ejecuta con `exec` si está definida.
  - **Telemetría:** la página carga un logo de `primeradiant.com` con la
    versión en la URL. Se apaga con `SUPERPOWERS_DISABLE_TELEMETRY`,
    `DISABLE_TELEMETRY` o `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`.
  - Lee variables `BRAINSTORM_*`.
- **Parches:** ninguno. La orquestadora debería pedir el visual companion con
  la telemetría apagada.

## coreyhaines31/marketingskills

- **Commit:** `e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b` · **Licencia:** MIT.
- **Se copió:** customer-research, competitor-profiling, pricing,
  copywriting, copy-editing, **product-marketing**, launch, seo-audit, schema,
  site-architecture y aso. Cada una con sus `references/` y `evals/`.
- **Nombre corregido:** `product-marketing-context` no existe como skill. Es
  el nombre viejo del archivo de contexto (`product-marketing-context.md`)
  que hoy escribe la skill `product-marketing` en `.agents/product-marketing.md`.
  Se copió `product-marketing`.
- **Riesgo:** sólo markdown y JSON de evals.
- **Parches:** ninguno.

## supabase/agent-skills

- **Commit:** `c9be0e931b7930f7d02126d04774d904c381e7d7` · **Licencia:** MIT.
- **Se copió:** las dos: `supabase` (4 archivos) y
  `supabase-postgres-best-practices` (36 archivos). Todo markdown.
- **Riesgo:** sólo texto. Ojo: es consejo genérico de Supabase. En Idealas
  mandan las reglas de §6.1 y §6.2 de CLAUDE.md.
- **Parches:** ninguno.

## trailofbits/skills

- **Commit:** `196a9073ab10d35bacf111f945e02c00b2c6883a` · **Licencia:**
  CC-BY-SA-4.0. Atribución a Trail of Bits y **misma licencia** para estas
  carpetas y cualquier obra derivada de ellas: el resto del plugin no la
  hereda, pero un cambio a estas carpetas sí.
- **Se copió:** `agentic-actions-auditor`, `supply-chain-risk-auditor` y
  `differential-review`, sólo su carpeta `skills/<nombre>/`.
- **Se dejó fuera:**
  - **`insecure-defaults`**: no es una skill. Es un comando
    (`commands/audit.md`) que lanza una cadena de agentes con la herramienta
    Workflow (`workflows/audit.js`). No cabe en `skills/`; si se quiere, entra
    como su propio plugin.
  - El agente `differential-review:adversarial-modeler` (`agents/`). La skill
    lo nombra para la fase 5 de alto riesgo y, sin él, esa delegación falla.
- **Riesgo:**
  - Las tres declaran `allowed-tools` (Read, Grep, Glob, Bash, y Write en dos).
  - `supply-chain-risk-auditor/scripts/` (Python, sin dependencias) consulta
    con los **nombres de paquetes** del proyecto, sin PII: osv.dev,
    registry.npmjs.org, api.npmjs.org, pypi.org, proxy.golang.org, deps.dev,
    api.github.com y api.scorecard.dev.
  - Lee el token de `gh auth token` y lo manda sólo a api.github.com.
  - Corre `pip-audit` con `--no-deps --disable-pip`, para no ejecutar
    `setup.py` ajeno.
- **Parches:** ninguno.

## GoogleChrome/modern-web-guidance

- **Commit:** `65e7edd67e77420eaf02c5df00fdc0521417d809` · **Licencia:**
  Apache-2.0.
- **Se copió:** `modern-web-guidance` y `chrome-extensions` (217 markdown
  entre las dos).
- **Se dejó fuera:** el CLI, `package.json` y los manifiestos de Gemini y
  Kimi.
- **Riesgo:** sólo markdown. `chrome-extensions` no tiene uso inmediato en el
  motor, pero viene en el mismo paquete.
- **Parches:** ninguno.

## vercel-labs/agent-skills

- **Commit:** `063bee94c3f4df8453406c830b0a7df0f2860278` · **Licencia:** MIT
  según su README. El repo **no trae archivo LICENSE**; ver la nota en
  `licencias/vercel-labs__agent-skills.LICENSE`.
- **Se copió:** sólo `web-design-guidelines`, más su archivo de reglas.
- **Riesgo encontrado, y parcheado:** la skill pedía bajar sus reglas de
  `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
  en cada uso, con WebFetch. Eran instrucciones remotas que cambian sin aviso.
- **Parches:**
  - `command.md`, agregado: es `vercel-labs/web-interface-guidelines@434b7f91364665f2f733b310ec54809bf8f37937`
    (MIT), tal cual. No contiene URLs que mande buscar.
  - `SKILL.md`: los pasos ahora leen `command.md` del folder de la skill
    (`${CLAUDE_SKILL_DIR}/command.md`), sin WebFetch ni la URL.
