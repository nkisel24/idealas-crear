# Fase 17 · Publicación

## Para qué
Poner el producto en producción con su dominio y verificar desde fuera que de
verdad está ahí y funciona.

## Entra
- `.idealas/fases/12-plan-tecnico/arquitectura.md` (dónde se hospeda)
- `.idealas/fases/15-pruebas/reporte.md` (todo en verde)
- `.idealas/fases/16-lanzamiento/*`

## El plan que presentas
`.idealas/fases/17-publicacion/plan.md`:

```markdown
# Plan · Publicación
- Dónde: <hospedaje>, dominio: <…>
- Quién ejecuta el deploy: <persona> (los pasos que tocan producción se aprueban uno por uno)
- Checklist previo: <lista>
- Verificación externa después: <lista>
- Tiendas (si aplica): <…>
```

## Pasos
1. **Checklist previo**:
   - pruebas de la fase 15 en verde;
   - Aviso y términos revisados por el abogado, sin marca de borrador;
   - variables de entorno de producción configuradas (nunca en el repo);
   - dominio y DNS apuntando; HTTPS;
   - marca de agua presente (ver `marca-de-agua.md`);
   - respaldo de la base si ya hay datos.
2. **Deploy.** Cada paso que toca producción se anuncia y se aprueba antes de
   ejecutarse. Si el hospedaje es de Idealas, lo ejecuta el equipo con sus
   procedimientos.
3. **Verificación externa** (desde fuera, como la vería un usuario):
   - `curl -sI https://<dominio>` → 200;
   - las redirecciones (`www` → apex o al revés) correctas;
   - un recorrido real con Playwright contra producción;
   - `lighthouse_audit` contra producción;
   - la marca de agua visible y con enlace a https://idealas.mx.
4. **Tiendas** (si es móvil): ficha con `idealas:aso`, capturas, políticas; el
   envío lo hace el usuario con su cuenta.
5. Anuncia el lanzamiento según el plan de la fase 16.

## Herramientas
- MCP `playwright`, `chrome-devtools`.
- `idealas:aso` para tiendas.

## Sale
- `.idealas/fases/17-publicacion/checklist.md` con cada punto marcado.
- `.idealas/fases/17-publicacion/verificacion.md`: comandos y resultados reales,
  con fecha.

## Listo cuando
- La verificación externa pasa completa, con evidencia.
- El estado registra la URL de producción y la fecha.

## Trampas
- «El deploy salió verde» no es «funciona»: se verifica desde fuera.
- Secretos de producción pegados en el chat: se rotan.
- Publicar en tiendas con la cuenta de otra persona.
