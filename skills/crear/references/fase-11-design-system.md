# Fase 11 · Design system

## Para qué
Dejar la marca y el diseño en una sola fuente reutilizable: tokens, componentes
y guía, para que cualquier diseño futuro de la misma marca salga consistente.

## Entra
- `.idealas/fases/07-marca/DESIGN.md` (el contrato)
- `.idealas/fases/10-diseno/pantallas.md` (componentes realmente usados)

## El plan que presentas
`.idealas/fases/11-design-system/plan.md`:

```markdown
# Plan · Design system
- Tokens: formato DTCG (una fuente) → Style Dictionary → CSS vars, Tailwind, TS
- Capas: primitivos → semánticos → de componente
- Componentes a documentar: <lista>
- Documentación: README + <Storybook si el proyecto lo usa>
- Dónde vive: <ruta en el repo del proyecto>
```

## Pasos
1. **Tokens en una sola fuente** con formato DTCG (W3C design tokens): color
   (claro y oscuro), tipografía, espacio, radios, sombras, duraciones y curvas.
   Tres capas: primitivos, semánticos (`--text-primary`, `--surface-page`) y de
   componente.
2. Compílalos con **Style Dictionary** instalado en el repo del proyecto (con
   versión exacta) a CSS custom properties, tema de Tailwind y TS.
3. **Componentes**: los de la fase 10, cada uno con props, variantes, estados
   (hover, foco, deshabilitado, error, carga) y reglas de uso. Base shadcn +
   Base UI; los de registries con su licencia.
4. **Documentación**: README del sistema (cómo se carga, reglas que no se
   negocian, ejemplos). Si el proyecto usa Storybook, el MCP de Storybook
   (`@storybook/addon-mcp`) se instala **como dependencia del proyecto** para
   que los agentes lean y escriban stories.
5. Si el usuario quiere el sistema también como artifact (claude.ai), el tipo
   «Design System» sirve para publicarlo.
6. `idealas:ui-ux-pro-max` revisa la coherencia; `idealas:review-animations`
   revisa los tokens de motion.

## Herramientas
- MCP `shadcn`, `idealas:ui-ux-pro-max`, `idealas:stitch-design-taste` (si se
  quiere un `DESIGN.md` para Google Stitch), `idealas:review-animations`,
  `idealas:design-motion-principles`.
- Style Dictionary y Storybook son dependencias del proyecto: pasan por
  justificación y versión exacta.

## Sale
- `.idealas/fases/11-design-system/tokens.json` (DTCG) o su ruta en el repo
- `.idealas/fases/11-design-system/README.md`
- `.idealas/fases/11-design-system/componentes.md`
- La configuración de Style Dictionary y los archivos generados, en el repo.

## Listo cuando
- Cambiar un color en `tokens.json` y recompilar lo cambia en toda la app.
- Ningún componente usa un color o tamaño literal.
- Cada componente tiene sus estados documentados.

## Trampas
- Dos fuentes de verdad (tokens en Figma y otros en CSS): una se queda vieja.
- Un design system con componentes que ninguna pantalla usa.
