# Fase 05 · Alcance del MVP

## Para qué
Decidir qué entra en la primera versión, qué NO entra y cómo se sabrá que
funcionó. Sin esto, el diseño y la construcción crecen sin borde.

## Entra
- `.idealas/fases/compuerta/veredicto.md` (con «sigue» o «sigue con cambios»)
- `.idealas/fases/01-idea/*`, `03-validacion/*`, `04-negocio/modelo.md`

## El plan que presentas
`.idealas/fases/05-mvp/plan.md`:

```markdown
# Plan · MVP
- Problema que el MVP resuelve (uno): <…>
- Usuario principal: <…>
- Funciones candidatas: <lista>
- Método para cortar: <MoSCoW o «una sola tarea de punta a punta»>
- Métrica de éxito: <número y fecha>
```

## Pasos
1. Lista todas las funciones candidatas que salieron de 01–04.
2. Córtalas con MoSCoW (debe, debería, podría, no ahora). El MVP es sólo «debe».
3. Escribe historias de usuario de lo que entra: «Como <quién>, quiero <qué>
   para <para qué>», cada una con criterios de aceptación verificables.
4. Escribe la lista **«No entra (todavía)»**: tan importante como lo que entra.
5. Define **una** métrica de éxito con número y fecha, ligada a una predicción
   de la fase 03.
6. Si el usuario quiere el formato de especificación, usa `idealas:to-spec`
   (o `product-management:write-spec` si está).

## Herramientas
- `idealas:to-spec`, `idealas:writing-plans`.
- `product-management:write-spec` si está.

## Sale
- `.idealas/fases/05-mvp/alcance.md`: problema, usuario, funciones que entran,
  historias con criterios, «No entra (todavía)», métrica de éxito.

## Listo cuando
- Cada historia tiene criterios de aceptación que un test podría comprobar.
- La lista «No entra» tiene al menos tantas cosas como la de «Entra».
- La métrica tiene número y fecha.

## Trampas
- «Login con Google, panel de admin y notificaciones» casi nunca son el MVP.
- Si todo es «debe», no se cortó nada.
- Un MVP que no prueba ninguna predicción de la fase 03 está midiendo otra cosa.
