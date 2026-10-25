# Fase 08 · Arquitectura de información y flujos

## Para qué
Decidir qué pantallas existen, cómo se llega a cada una y qué camino recorre el
usuario para cumplir cada historia del MVP. Sin esto, los wireframes dibujan
pantallas sueltas.

## Entra
- `.idealas/fases/05-mvp/alcance.md` (historias y criterios)
- `.idealas/fases/07-marca/voz.md` (nombres de secciones y botones)

## El plan que presentas
`.idealas/fases/08-flujos/plan.md`:

```markdown
# Plan · Flujos
- Mapa de pantallas: <lista inicial>
- Flujos a dibujar: <uno por historia del MVP>
- Estados que cada pantalla debe contemplar: vacío, carga, error, éxito
- Formato: diagrama (excalidraw o mermaid) + texto
```

## Pasos
1. Mapa del sitio o de la app: pantallas y jerarquía. Usa
   `idealas:site-architecture` para sitios.
2. Por cada historia del MVP, el flujo paso a paso: pantalla → acción → pantalla,
   incluido el camino de error.
3. Por cada pantalla, sus estados: vacío, carga, error, éxito, sin permiso.
4. Nombres de navegación con la voz de la marca.
5. Dibuja el mapa y los flujos con el MCP `excalidraw` o con mermaid en markdown.

## Herramientas
- `idealas:site-architecture`.
- MCP `excalidraw`: el remoto recibe el diagrama; **nunca** pongas datos
  personales ni datos reales de clientes en él.
- Mermaid en markdown como alternativa local.

## Sale
- `.idealas/fases/08-flujos/mapa.md` (con diagrama)
- `.idealas/fases/08-flujos/flujos.md`: un flujo por historia, con estados.

## Listo cuando
- Cada historia del MVP tiene un flujo completo, incluido su camino de error.
- Cada pantalla tiene sus estados listados.

## Trampas
- Diseñar pantallas que ninguna historia necesita.
- Olvidar el estado vacío: es la primera pantalla que ve todo usuario nuevo.
