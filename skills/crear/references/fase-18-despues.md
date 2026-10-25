# Fase 18 · Después del lanzamiento

## Para qué
Medir lo que pasó, cerrar las predicciones de la fase 03 con su resultado y
decidir qué sigue. Sin esto, el motor termina justo cuando empieza lo difícil.

## Entra
- `.idealas/fases/03-validacion/predicciones.md`
- `.idealas/fases/05-mvp/alcance.md` (métrica de éxito y «No entra (todavía)»)
- `.idealas/fases/16-lanzamiento/analitica.md`
- Datos reales de uso (agregados, sin datos personales)

## El plan que presentas
`.idealas/fases/18-despues/plan.md`:

```markdown
# Plan · Después
- Cuándo se mide: <fecha, típicamente 2–4 semanas después del lanzamiento>
- Qué se mide: métrica de éxito + predicciones con fecha vencida
- Fuentes: analítica, soporte, entrevistas
- Lo que sale: cierre de predicciones, aprendizajes, siguiente ciclo
```

## Pasos
1. **Métrica de éxito** de la fase 05: valor real contra el objetivo.
2. **Cierra cada predicción** de la fase 03 cuya fecha ya pasó: **acertada** o
   **fallida**, con su evidencia. Sin reinterpretar el criterio después del
   hecho. Las que no han vencido se quedan abiertas con su fecha.
3. Qué aprendimos: lo que se confirmó, lo que se cayó y lo que nadie vio venir.
4. Feedback de usuarios y soporte, agrupado por tema.
5. **Qué sigue**: tres opciones con su porqué (iterar el MVP, tomar algo de «No
   entra (todavía)», cambiar de segmento o detener). Si el siguiente ciclo
   cambia el alcance, vuelve a la fase 05 con el estado nuevo.

## Herramientas
- `product-management:metrics-review` y `product-management:synthesize-research`
  si están.
- MCP `chrome-devtools` para revisar rendimiento real.

## Sale
- `.idealas/fases/18-despues/cierre-predicciones.md`: la tabla de la fase 03
  con la columna Resultado llena.
- `.idealas/fases/18-despues/aprendizajes.md`
- `.idealas/fases/18-despues/siguiente.md`

## Listo cuando
- Cada predicción vencida tiene «acertada» o «fallida» con evidencia.
- Hay una decisión de qué sigue.

## Trampas
- Mover el criterio de una predicción para que «acierte».
- Leer datos individuales de usuarios: se mide en agregado.
