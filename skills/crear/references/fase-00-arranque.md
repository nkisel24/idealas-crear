# Fase 00 · Arranque

## Para qué
Saber con quién trabajas, qué trae y a dónde va, para que ninguna fase vuelva a
preguntar lo mismo. Aquí se decide qué fases aplican y cuáles se saltan.

## Entra
- Lo que el usuario escribió al llamar `/idealas:crear` (su idea, en sus palabras).
- Si ya existe `.idealas/estado.json`, NO estás en arranque: el orquestador retoma
  la fase que marque el estado.
- Lo que haya en el repo actual: README, `package.json`, carpetas de marca o
  diseño. Léelo antes de preguntar; no preguntes lo que ya está escrito.

## El plan que presentas
Escríbelo en `.idealas/fases/00-arranque/plan.md`:

```markdown
# Plan · Arranque
- Proyecto: <nombre provisional o «sin nombre»>
- Quién lo lleva en Idealas: <persona del equipo>
- Fundador(es): <rol, no datos personales>
- Camino de Idealas: <tú con IA sobre la base | nosotros hacemos la primera versión | contratar a tu primer técnico | todavía no se sabe>
- Qué ya existe: <marca, nombre, diseños, código, usuarios>
- Presupuesto y plazo: <rango y fecha objetivo>
- Fases que aplican: <lista>
- Fases que se saltan y por qué: <fase → porqué>
- Primera fase después de esta: <NN>
```

## Pasos
1. Pide en una sola tanda (no una pregunta por mensaje):
   - la idea en dos frases;
   - qué ya existe (nombre, marca, logo, diseños, código, usuarios, ventas);
   - presupuesto en rango y fecha objetivo;
   - tipo de producto (web, app móvil, servicio, mixto);
   - quién del equipo de Idealas lo lleva.
2. Decide el camino de Idealas con el usuario. Los tres caminos del sitio:
   «Tú, con IA, sobre la base», «Nosotros hacemos la primera versión» y «Te
   ayudamos a contratar a tu primer técnico». Si todavía no se sabe, anótalo:
   la compuerta (después de la fase 4) lo vuelve a preguntar.
3. Decide qué fases aplican. Reglas por defecto:
   - Ya trae nombre registrado → la 06 se reduce a verificar dominio e IMPI.
   - Ya trae marca completa → la 07 se reduce a documentarla en DESIGN.md.
   - Landing de una sola página → la 08 es un mapa de una pantalla.
   - Sin datos personales de usuarios → la 13 se reduce al Aviso del formulario
     de contacto (casi nunca hay cero datos).
   - Ninguna fase se salta sin porqué escrito.
4. Arma la ficha y el plan. Preséntalo y espera aprobación explícita.

## Herramientas
- `idealas:grill-me` si la idea llega en una línea vaga: sirve para afilarla,
  pero no la conviertas en la fase 01 completa.
- Nada externo. Esta fase no busca en internet.

## Sale
- `.idealas/fases/00-arranque/plan.md`
- `.idealas/fases/00-arranque/ficha.md`: la ficha del proyecto, la que leen
  todas las fases siguientes.

## Listo cuando
- La ficha tiene todos los campos (o «no se sabe» explícito).
- Cada fase aparece como «aplica» o «se salta» con su porqué.
- El usuario aprobó el plan.

## Trampas
- No pidas nombre, correo ni teléfono del fundador: la ficha no los necesita.
  Usa roles («fundadora», «cofundador técnico»).
- No prometas fechas ni precios de Idealas: eso lo decide el equipo, no el motor.
- Saltarte fases para «ir rápido» es la forma más común de construir lo que
  nadie pidió. Si el usuario quiere saltar 03 o 05, anota el riesgo en la ficha.
