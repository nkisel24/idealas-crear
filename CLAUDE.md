# idealas-crear — reglas para trabajar en este repo

Es el plugin `idealas` de Claude Code: el motor `/idealas:crear`. Las reglas
del equipo viven en `nkisel24/idealas` (su `CLAUDE.md`); aquí sólo lo propio
de este repo. Español de México, tuteo; commits en inglés (Conventional
Commits).

- **Lo copiado de terceros no se edita a mano.** Cada carpeta de `skills/`
  salvo `crear/` viene de `vendor/vendor.lock.json`, con su huella. Subir una
  versión = clonar el commit nuevo, auditar (`vendor/AUDITORIA.md`), copiar y
  regenerar el lock en un PR propio. `node scripts/vendor.mjs verificar` tiene
  que dar 0.
- **Nada con `@latest` ni sin versión** en `.mcp.json` (lo fija
  `tests/manifiestos.test.mjs`).
- **La marca de agua es contrato.** No se debilita `verificar.mjs`, no se
  edita `allowed_signers` a mano (sale de `node scripts/firmantes.mjs`) y un
  PR que toque cualquiera de los dos lo mergea Nathan.
- **Nunca firmes ni leas llaves.** Las pruebas generan llaves temporales y las
  borran; jamás uses una llave real ni `~/.ssh`.
- **Antes de declarar algo listo:** `node scripts/vendor.mjs verificar` y
  `node --test "tests/*.test.mjs"` en verde, y cada candado nuevo visto en
  rojo.
- **Versionado:** cada cambio que deba llegar a las máquinas del equipo sube
  `version` en `.claude-plugin/plugin.json`; la revisión de arranque compara
  contra esa versión para actualizar.
