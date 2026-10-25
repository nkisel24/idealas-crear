# Fase 01 · Definir la idea

## Para qué
Convertir la idea en algo que se pueda contradecir: un problema concreto, para
alguien concreto, con una propuesta de valor que se pueda probar.

## Entra
- `.idealas/fases/00-arranque/ficha.md`.

## El plan que presentas
`.idealas/fases/01-idea/plan.md`:

```markdown
# Plan · Idea
- Método: entrevista (grill-me) + lean canvas
- Preguntas que voy a hacer: <5–10>
- Lo que sale: idea.md, lean-canvas.md, supuestos.md
- Lo que NO hago en esta fase: investigar mercado, nombrar, diseñar
```

## Pasos
1. Entrevista al usuario con `idealas:grill-me`: problema, quién lo sufre, cómo lo
   resuelve hoy, cuánto le cuesta no resolverlo, por qué ahora, por qué ustedes.
2. Si la idea es difusa o tiene varias ramas, usa `idealas:brainstorming` (o
   `product-management:brainstorm` si está) para abrir opciones y luego cierra a
   una con el usuario.
3. Escribe el **lean canvas**: problema (top 3), segmento, propuesta única de
   valor, solución, canales, ingresos, costos, métricas clave, ventaja injusta.
4. Separa **hechos** de **supuestos**. Cada supuesto con: qué lo haría falso y
   en qué fase se prueba (02 mercado, 03 validación, 04 negocio).
5. Si la idea ya tiene forma de especificación, `idealas:to-spec` deja un
   borrador que la fase 05 reutiliza.

## Herramientas
- `idealas:grill-me`, `idealas:brainstorming`, `idealas:to-spec`.
- `product-management:brainstorm` si está instalada.

## Sale
- `.idealas/fases/01-idea/idea.md`: problema, para quién, propuesta de valor,
  en menos de una página.
- `.idealas/fases/01-idea/lean-canvas.md`
- `.idealas/fases/01-idea/supuestos.md`: tabla `Supuesto | Qué lo haría falso | Fase que lo prueba`.

## Listo cuando
- El problema se puede decir en una frase sin la palabra «plataforma».
- El segmento es tan concreto que se le puede escribir a 10 personas de él.
- Hay al menos 3 supuestos críticos con su fase de prueba.

## Trampas
- Una solución disfrazada de problema («falta una app de X») no es problema.
- «Todo el mundo» no es segmento.
- No defiendas la idea: el trabajo de esta fase es encontrarle los huecos.
