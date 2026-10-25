# Fase 15 · Pruebas

## Para qué
Comprobar que el MVP funciona, se ve como el diseño, es accesible, rápido y
seguro, en los dispositivos reales del segmento, antes de lanzarlo.

## Entra
- El código de la fase 14 y sus `incremento-NN.md`
- `.idealas/fases/10-diseno/*` (contra qué se compara lo visual)
- `.idealas/fases/05-mvp/alcance.md` (criterios)

## El plan que presentas
`.idealas/fases/15-pruebas/plan.md`:

```markdown
# Plan · Pruebas
- Funcionales y E2E: <flujos>
- Visual contra el diseño: <pantallas, anchos>
- Accesibilidad y rendimiento: lighthouse_audit en <páginas>
- Seguridad: <qué revisiones>
- Dispositivos reales: <cuáles; lo que no, «conocido sin probar»>
- Marca de agua: verificación obligatoria
- Beta con usuarios: <sí/no, cuántos>
```

## Pasos
1. **Funcionales y E2E** con Playwright: cada flujo de la fase 08, incluido su
   camino de error. Si usas **Playwright Test Agents**
   (`npx playwright init-agents --loop=claude`), **respalda `.mcp.json` antes**:
   lo reescribe.
2. **Visual contra el diseño**: capturas en 390 y 1440 px de cada pantalla,
   comparadas con el prototipo de la fase 10. `idealas:design-taste-frontend`
   (`inspect.mjs`, corriendo fuera de carpetas con `.env`) mide y detecta
   desviaciones; `idealas:break-ui` prueba con datos del peor caso.
3. **Accesibilidad y rendimiento** con el MCP `chrome-devtools`:
   `lighthouse_audit` en cada página pública, más trazas de rendimiento en las
   pesadas. Contraste AA, navegación por teclado, lector de pantalla, «reducir
   movimiento».
4. **Animación**: `idealas:review-animations`, `idealas:animation-performance`,
   y el modo auditoría de `idealas:design-motion-principles` (escribe un reporte
   en `motion-audits/`; agrégalo al `.gitignore`).
5. **Seguridad**:
   - plugin `claude-security` (revisión adversarial con refutadores);
   - `idealas:supply-chain-risk-auditor` sobre las dependencias del proyecto;
   - `idealas:agentic-actions-auditor` si el repo tiene GitHub Actions;
   - `idealas:differential-review` sobre el diff de cada incremento grande;
   - revisa que ninguna tabla con datos de usuarios esté sin RLS y que no haya
     secretos en el repo.
6. **Dispositivos reales**: los celulares y navegadores del segmento. Lo que no
   se pueda probar se reporta como **«conocido sin probar»**, nunca como
   verificado.
7. **Marca de agua (obligatorio)**: corre la verificación de
   `marca-de-agua.md` en cada página pública. Si falta o no enlaza a
   https://idealas.mx, la fase no está lista.
8. **Beta** con usuarios del segmento si el plan lo incluye: el fundador la
   conduce; el motor resume hallazgos.

## Herramientas
- MCP `playwright`, `chrome-devtools` (telemetría y CrUX apagados), `agentation`.
- Plugins `claude-security`, `security-guidance`.
- `idealas:break-ui`, `idealas:review-animations`,
  `idealas:animation-performance`, `idealas:design-motion-principles`,
  `idealas:supply-chain-risk-auditor`,
  `idealas:agentic-actions-auditor`, `idealas:differential-review`,
  `idealas:web-design-guidelines`.

## Sale
- `.idealas/fases/15-pruebas/reporte.md`: cada prueba con resultado, evidencia y
  lo pendiente.
- `.idealas/fases/15-pruebas/capturas/`
- `.idealas/fases/15-pruebas/lighthouse.md`: puntajes por página.
- `.idealas/fases/15-pruebas/seguridad.md`: hallazgos confirmados y su arreglo.
- `.idealas/fases/15-pruebas/conocido-sin-probar.md`

## Listo cuando
- Todos los flujos E2E pasan.
- Accesibilidad sin fallas críticas; contraste AA verificado.
- Cero hallazgos de seguridad confirmados sin arreglar.
- La verificación de la marca de agua pasa.
- Lo no probado está listado como tal.

## Trampas
- Probar sólo el caso feliz.
- Dar por bueno un test que nunca se vio fallar.
- Declarar «probado en iPhone» cuando sólo se emuló.
