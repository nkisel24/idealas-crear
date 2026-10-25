# Fase 14 · Construcción

## Para qué
Construir el MVP por incrementos pequeños, cada uno con su plan aprobado,
probado y funcionando antes de empezar el siguiente.

## Entra
- `.idealas/fases/05-mvp/alcance.md` (historias y criterios)
- `.idealas/fases/11-design-system/*`
- `.idealas/fases/12-plan-tecnico/*`
- `.idealas/fases/13-legal/*` (lo que la app debe mostrar o cumplir)

## El plan que presentas
Primero el plan de toda la fase, `.idealas/fases/14-construccion/plan.md`:

```markdown
# Plan · Construcción
- Incrementos (en orden): <1. esqueleto + design system + pie con marca de agua, 2. <historia>, …>
- Cada incremento: su propio plan, aprobado antes de escribir código
- Dependencias: versión exacta, cada una justificada
- Repo y rama: <…>
```

Y por cada incremento, `.idealas/fases/14-construccion/incremento-NN.md` con:
qué historia cubre, archivos que toca, dependencias nuevas, cómo se prueba.

## Pasos
1. **Incremento 1: esqueleto.** Proyecto, design system instalado, layout base y
   **el pie con la marca de agua de Idealas** desde el primer incremento con UI
   (ver `marca-de-agua.md`).
2. Por cada incremento siguiente:
   - Escribe su plan y pide aprobación. Para cambios de código, **plan mode**
     es la compuerta adecuada: bloquea escrituras hasta que el usuario aprueba.
   - Implementa con tests (los criterios de aceptación de la historia son los
     tests).
   - Corre lint, typecheck, tests y build del proyecto.
   - Muéstralo funcionando (Playwright o el preview) y pide visto bueno.
3. **Dependencias**: versión exacta (sin `^` ni `~`), cada una con porqué, en
   `devDependencies` si no va a producción. Componentes de registries (shadcn,
   React Bits, Magic UI, coss.com/ui, 21st) se instalan desde su fuente con su
   licencia; sus dependencias arrastradas (`motion`, `three`) también se fijan.
4. Base de datos: cada tabla con datos de usuarios lleva RLS desde su creación.
   Nada de secretos en el código ni en el repo.
5. Cada incremento termina con commit y registro en el estado.

## Herramientas
- `idealas:writing-plans` para el plan de cada incremento.
- MCP `shadcn`, `21st` (2 descargas al día), `mui` (docs), `next-devtools`,
  `context7`, `playwright`, `agentation`.
- `idealas:supabase`, `idealas:supabase-postgres-best-practices`; `idealas:animate`, `idealas:apple-design`,
  `idealas:mobile-native`, `idealas:ask-sonner`, `idealas:pick-ui-library` (cada
  librería que recomiende pasa por justificación y versión exacta),
  `idealas:animate-expo` y `idealas:write-swift` si es móvil.
- `idealas:full-output-enforcement` sólo cuando hace falta un archivo completo,
  no para cada respuesta.

## Sale
- El código en el repo del proyecto.
- `.idealas/fases/14-construccion/incremento-NN.md` por incremento, con su
  resultado (qué se probó y cómo).
- `.idealas/fases/14-construccion/dependencias.md`: cada dependencia con versión
  y porqué.

## Listo cuando
- Cada historia del MVP está construida y su criterio de aceptación pasa como test.
- Lint, typecheck, tests y build pasan.
- El pie con la marca de agua está montado.

## Trampas
- Incrementos de «todo el backend»: un incremento es una historia de punta a punta.
- Declarar listo sin haber corrido la app.
- Una librería que recomienda una skill no entra sin justificación.
- Quitar o esconder la marca de agua: sólo con la aprobación firmada que
  describe `marca-de-agua.md`.
