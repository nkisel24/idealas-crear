# Fase 02 · Investigación de mercado

## Para qué
Saber contra quién compite la idea, qué tan grande es el mercado en México y qué
tendencias o reglas lo mueven, con fuentes que se puedan revisar.

## Entra
- `.idealas/fases/00-arranque/ficha.md`
- `.idealas/fases/01-idea/idea.md`, `lean-canvas.md`, `supuestos.md`

## El plan que presentas
`.idealas/fases/02-mercado/plan.md`:

```markdown
# Plan · Mercado
- Preguntas que contesto: <competencia directa e indirecta, tamaño en MX, tendencias, regulación del sector>
- Fuentes: <búsqueda web con citas, INEGI/DENUE, reportes públicos>
- Lo que NO mando a terceros: datos personales del fundador o de clientes
- Lo que sale: competencia.md, mercado.md, regulacion.md, fuentes.md
```

## Pasos
1. **Competencia.** Directa (resuelve lo mismo), indirecta (otra solución al
   mismo problema) y el sustituto real (Excel, WhatsApp, «no hacer nada»).
   Por cada competidor: qué ofrece, precio público, a quién apunta, fuerza y
   hueco. Usa `idealas:competitor-profiling` para el formato.
2. **Tamaño de mercado en México.** De abajo hacia arriba cuando se pueda:
   cuántas unidades del segmento existen × cuánto pagarían. Para negocios,
   DENUE (inegi.org.mx/app/mapa/denue) por actividad y estado; para personas,
   censos y encuestas del INEGI. **Por ahora se consulta a mano** en el sitio
   del INEGI: anota la consulta exacta y la fecha para que se pueda repetir.
3. **Tendencias.** Qué está cambiando (precios, regulación, tecnología, hábitos)
   y desde cuándo. Cada afirmación con su fuente.
4. **Regulación del sector.** Si el producto toca salud, finanzas, menores,
   educación o datos sensibles, anótalo como riesgo para la fase 13. Sin
   dictaminar: sólo identificar.
5. Contrasta cada supuesto de `01-idea/supuestos.md` que esta fase prueba:
   se sostiene, se cae o sigue abierto.

## Herramientas
- MCP `exa` para búsqueda con fuentes citables (plan anónimo con límite de uso).
- `deep-research` si está disponible, para preguntas de varios pasos.
- `idealas:customer-research` y `idealas:competitor-profiling` para el formato.
- Playwright para leer una página puntual que la búsqueda no trae completa.

## Sale
- `.idealas/fases/02-mercado/competencia.md`: tabla por competidor.
- `.idealas/fases/02-mercado/mercado.md`: tamaño con su cálculo visible.
- `.idealas/fases/02-mercado/regulacion.md`
- `.idealas/fases/02-mercado/fuentes.md`: cada fuente con URL y fecha de consulta.
- Actualiza `01-idea/supuestos.md` con el estado de cada supuesto.

## Listo cuando
- Cada número tiene fuente y fecha.
- Hay al menos 3 competidores o sustitutos reales (si no los hay, explica por
  qué, y desconfía).
- El tamaño de mercado muestra el cálculo, no sólo el resultado.

## Trampas
- **Nunca** mandes a un buscador o API el nombre, correo o datos del fundador o
  de sus clientes. La consulta describe el mercado, no a las personas.
- Un TAM global copiado de un reporte no dice nada del mercado mexicano.
- «No hay competencia» casi siempre significa «no busqué el sustituto».
- No hagas scraping masivo de sitios: lee páginas puntuales.
