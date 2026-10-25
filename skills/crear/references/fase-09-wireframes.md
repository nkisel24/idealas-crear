# Fase 09 · Wireframes

## Para qué
Acordar la estructura de cada pantalla en baja fidelidad, antes de gastar en
color, tipografía y detalle.

## Entra
- `.idealas/fases/08-flujos/mapa.md`, `flujos.md`
- `.idealas/fases/05-mvp/alcance.md`

## El plan que presentas
`.idealas/fases/09-wireframes/plan.md`:

```markdown
# Plan · Wireframes
- Pantallas a dibujar: <lista, sólo las del MVP>
- Anchos: celular (390) y escritorio (1440)
- Formato: excalidraw o HTML en escala de grises
- Lo que se aprueba: estructura y jerarquía, no estética
```

## Pasos
1. Dibuja cada pantalla del MVP en escala de grises: bloques, jerarquía y
   contenido real (no lorem ipsum: usa la voz de la fase 07).
2. Celular primero, luego escritorio.
3. Marca qué componente de la base (shadcn) sería cada bloque: eso adelanta la
   fase 11.
4. Para un recorrido clicable rápido, un HTML en grises basta. Si el usuario
   quiere comparar dos estructuras, `idealas:prototype` las pone lado a lado.
5. Presenta y recoge cambios. Itera hasta aprobación.

## Herramientas
- MCP `excalidraw` para bocetos (sin datos personales).
- `idealas:prototype` para comparar variantes.
- `idealas:ui-ux-pro-max` para patrones de layout por tipo de producto.
- `idealas:design-taste-frontend` (`draw.mjs`) para proponer composición de
  landings.

## Sale
- `.idealas/fases/09-wireframes/<pantalla>.md` o `.excalidraw` / `.html` por pantalla.
- `.idealas/fases/09-wireframes/indice.md`: lista de pantallas con su estado
  (aprobada, cambios pedidos).

## Listo cuando
- Cada pantalla del MVP tiene wireframe aprobado en celular y escritorio.

## Trampas
- Meter color y tipografía aquí: distrae de la estructura.
- Lorem ipsum esconde problemas de largo de texto.
