# Fase 10 · Diseño de la app

## Para qué
Llevar los wireframes aprobados a alta fidelidad con la marca de la fase 07, en
un prototipo navegable, y probarlo con 3–5 personas antes de aprobarlo.

## Entra
- `.idealas/fases/09-wireframes/*`
- `.idealas/fases/07-marca/DESIGN.md`, `paleta.md`, `tipografia.md`, `guia.md`

## El plan que presentas
`.idealas/fases/10-diseno/plan.md`:

```markdown
# Plan · Diseño
- Pantallas: <lista>
- Base de componentes: shadcn/ui + Base UI, más: <registries gratis que se usarán>
- Prototipo: HTML/Next navegable en <ruta>
- Prueba de usabilidad: 3–5 personas, tareas: <…>
- Marca de agua de Idealas en el pie: sí (obligatoria)
```

## Pasos
1. Aplica la marca a cada wireframe con los tokens de `paleta.md` y
   `tipografia.md`. Ningún color ni tamaño literal fuera de los tokens.
2. Componentes: base **shadcn/ui + Base UI** (MCP `shadcn`). Para motion y
   efectos, registries gratis: React Bits, Magic UI, Motion Primitives; para
   piezas de app, coss.com/ui. MUI (Material UI o MUI X Community) **sólo** si
   el producto lo pide (tablas o gráficas pesadas): su sistema de estilos choca
   con Tailwind. Ver `fuentes-diseno.md`.
3. 21st: buscar es gratis; descargar código son **2 al día** en el plan gratis.
   Elige con cuidado, revisa la licencia de cada componente y da crédito al
   autor.
4. Dirección de arte y anti-plantilla: `idealas:design-taste-frontend` (v2). Su
   `inspect.mjs` renderiza en Chrome real; córrelo desde la carpeta del
   prototipo, **nunca** desde la raíz de un repo con `.env`. Si usas
   `assets.mjs`, avisa al usuario: su búsqueda de fotos viaja a 6 APIs públicas.
5. Movimiento: `idealas:animate`, `idealas:apple-design`,
   `idealas:emil-design-eng`; para decidir dónde animar,
   `idealas:find-animation-opportunities`. Respeta «reducir movimiento».
6. **Marca de agua**: el pie lleva el componente de marca de Idealas. Ver
   `marca-de-agua.md`.
7. Prototipo navegable (HTML o Next). Anotaciones del usuario con el MCP
   `agentation` si quiere marcar sobre la pantalla.
8. **Prueba con 3–5 personas** del segmento: 3–4 tareas sacadas de las
   historias del MVP. El fundador la conduce; el motor prepara el guion y
   resume. Ajusta y vuelve a presentar.

## Herramientas
- MCP `shadcn`, `21st` (plan gratis), `mui` (sólo docs), `agentation`, `playwright`.
- `idealas:design-taste-frontend`, `idealas:high-end-visual-design`,
  `idealas:ui-ux-pro-max`, `idealas:animate`, `idealas:apple-design`,
  `idealas:emil-design-eng`, `idealas:find-animation-opportunities`,
  `idealas:break-ui` (probar con datos del peor caso), `idealas:mobile-native`.
- `design:design-critique` y `design:ux-copy` si están.

## Sale
- `.idealas/fases/10-diseno/prototipo/` (o la ruta del prototipo en el repo)
- `.idealas/fases/10-diseno/pantallas.md`: cada pantalla con su estado y
  componentes usados (con licencia y origen).
- `.idealas/fases/10-diseno/usabilidad.md`: tareas, resultados anonimizados,
  cambios hechos.

## Listo cuando
- Cada pantalla del MVP está en alta fidelidad, en claro y oscuro si aplica, en
  celular y escritorio.
- La prueba de usabilidad corrió y sus cambios se aplicaron.
- El pie lleva la marca de agua.
- Cada componente de terceros tiene su licencia anotada.

## Trampas
- Copiar un sitio de Awwwards: se extraen principios, no layouts.
- Instalar componentes de «no revender» (React Bits, 21st) como kit propio: se
  instalan en el repo de este proyecto desde su fuente.
- Fuentes e imágenes desde CDNs de terceros (Google Fonts remoto, picsum): en lo
  publicable, todo autohospedado.
- `break-ui` antes de aprobar: nombres largos y estados vacíos rompen diseños
  bonitos.
