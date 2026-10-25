# idealas-crear

El motor de creación de Idealas: un plugin de Claude Code que lleva una idea
de cero a publicada, fase por fase, con un plan que apruebas antes de cada
fase y el avance guardado en el proyecto (`.idealas/estado.json`) para
retomarlo otro día o en otra máquina.

    /idealas:crear una app para reservar canchas de pádel en Monterrey
    /idealas:crear seguir

## Instalarlo (una vez por máquina)

### Con el instalador (recomendado)

Necesitas Node.js 24, Git, la CLI de GitHub (`gh`) con acceso a este repo y
Claude Code. Baja el instalador del último release:

```bash
gh release download instalador-1.0.0 --repo nkisel24/idealas-crear --dir instalador-idealas
```

Y ábrelo con doble clic: `Instalar-Idealas.cmd` en Windows,
`Instalar-Idealas.command` en macOS (si macOS no lo abre, clic derecho →
Abrir). O desde la terminal:

```bash
node instalador-idealas/instalar.mjs
```

Revisa todo, te ayuda a iniciar sesión en GitHub si hace falta, agrega el
marketplace, instala o actualiza el plugin, corre la revisión de arranque y,
si quieres, deja puesta tu llave de 21st (se escribe sin eco y nunca se
imprime). Otras formas de correrlo:

| Opción | Qué hace |
|---|---|
| `--revisar` | Sólo revisa la máquina; no instala ni cambia nada |
| `--desinstalar` | Quita el plugin y su marketplace (pregunta antes) |
| `--si` | No pregunta nada (salta la llave de 21st) |
| `--tema claro` | Colores para terminal de fondo claro |
| `--sin-color`, `--sin-animacion` | Para terminales sencillas o logs |

### A mano

El repo es privado: tu `git` tiene que poder clonarlo con tu sesión de GitHub.

```bash
gh auth login
```

```bash
gh auth setup-git
```

```bash
claude plugin marketplace add nkisel24/idealas-crear
```

```bash
claude plugin install idealas@idealas
```

Reinicia Claude Code. La primera vez que corras `/idealas:crear`, su revisión
de arranque instala sola lo auditado que falte (los plugins oficiales
`claude-security`, `playground` y `security-guidance`, y `context7`) y te dice
lo que sólo tú puedes hacer: la llave personal de 21st (plan gratis) y, si
faltan, Python 3 o Node 24. Cuando hay versión nueva del plugin, la misma
revisión la instala y te pide reiniciar.

## Qué trae

- **El orquestador** (`skills/crear/`): 19 fases más la compuerta «¿seguimos?»,
  cada una con su guía en `references/`, la revisión de arranque
  (`scripts/preflight.mjs`) y la marca de agua.
- **55 skills de terceros, copiadas y fijadas** a un commit auditado (Emil
  Kowalski, taste-skill v1 y v2, ui-ux-pro-max, logo-design, design motion
  principles, brag-slim, grill-me y to-spec, brainstorming y writing-plans,
  marketingskills, Supabase, Trail of Bits, modern-web-guidance,
  web-design-guidelines). Se invocan como `idealas:<nombre>`. Origen,
  licencia y auditoría: `vendor/`.
- **8 MCPs con versión fija** (`.mcp.json`): playwright, shadcn, agentation,
  chrome-devtools, next-devtools, mui, exa y excalidraw. La telemetría que se
  puede apagar va apagada.

Todo lo que trae es gratis. Lo que se dejó fuera y por qué está en
`skills/crear/references/herramientas.md`.

## La marca de agua

Todo lo público que sale del motor lleva al final del pie el wordmark de
Idealas con su enlace a idealas.mx. Se quita sólo con una exención firmada
con la llave SSH de Nathan o de Daniel; el verificador
(`skills/crear/scripts/marca/verificar.mjs`) lo comprueba en las pruebas y en
el CI de cada proyecto. Cómo funciona y cómo se firma una exención:
`skills/crear/references/marca-de-agua.md`.

**Para poder autorizar exenciones**, cada uno sube su llave pública SSH a
GitHub como *Signing Key* (Settings → SSH and GPG keys → New SSH key → Key
type: Signing Key) y luego, en este repo:

```bash
node scripts/firmantes.mjs
```

y abre un PR con el `allowed_signers` que resulte. Mientras la lista esté
vacía, ninguna exención pasa.

## Desarrollo

```bash
node scripts/vendor.mjs verificar
```

```bash
node --test "tests/*.test.mjs"
```

Sin dependencias: sólo Node 24, `git` y `ssh-keygen`. Las reglas para
trabajar aquí están en `CLAUDE.md`.
