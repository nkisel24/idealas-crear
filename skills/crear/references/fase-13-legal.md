# Fase 13 · Legal y privacidad

## Para qué
Dejar listos los borradores legales que el producto necesita antes de recolectar
un solo dato. En México, recolectar datos personales sin Aviso de Privacidad es
la falta. **El motor redacta borradores; no dictamina.**

## Entra
- `.idealas/fases/12-plan-tecnico/datos.md` (qué datos guarda y con quién los comparte)
- `.idealas/fases/02-mercado/regulacion.md`
- `.idealas/fases/00-arranque/ficha.md`

## El plan que presentas
`.idealas/fases/13-legal/plan.md`:

```markdown
# Plan · Legal
- Documentos: <Aviso de Privacidad integral y simplificado, términos, política de cookies, política de edad>
- Base: LFPDPPP publicada el 20 de marzo de 2025
- Todos los documentos salen como BORRADOR PARA REVISIÓN LEGAL
```

## Pasos
1. **Aviso de Privacidad** (integral y simplificado) desde el texto de la Ley
   Federal de Protección de Datos Personales en Posesión de los Particulares
   publicada el **20 de marzo de 2025**. Las facultades del INAI pasaron a la
   Secretaría Anticorrupción y Buen Gobierno: **no nombres al INAI** como
   autoridad; cualquier plantilla que lo nombre está vieja. Cubre: identidad del
   responsable, datos que se recaban (cada uno de `datos.md`), finalidades
   (primarias y secundarias), transferencias a terceros (cada integración de la
   fase 12), derechos ARCO y cómo ejercerlos, plazo de conservación,
   cookies y tecnologías de rastreo, y cambios al aviso.
2. **Todo dato con un límite conocido se declara con ese límite** (p. ej. una
   ubicación por IP no ubica a una persona; un correo confirmado prueba acceso a
   una casilla, no identidad).
3. **Términos de uso**: qué ofrece el producto, qué no, responsabilidades,
   pagos y cancelación si aplica.
4. **Política de edad**: si el producto puede recibir menores de 18, el
   tratamiento exige el consentimiento de quien ejerce la patria potestad.
   Decídelo con el equipo antes de abrir altas.
5. **Cookies**: sólo las estrictamente necesarias por defecto; si hay analítica,
   preferir una sin cookies y sin terceros (ver fase 16).
6. Cada documento lleva al inicio, en negritas: **«BORRADOR PARA REVISIÓN LEGAL.
   No publicar sin la revisión de un abogado.»**

## Herramientas
- Ninguna skill de terceros cubre la ley mexicana vigente: se redacta desde el
  texto de la ley. `deep-research` o `exa` para leer el texto oficial (DOF).

## Sale
- `.idealas/fases/13-legal/aviso-privacidad-integral.md`
- `.idealas/fases/13-legal/aviso-privacidad-simplificado.md`
- `.idealas/fases/13-legal/terminos.md`
- `.idealas/fases/13-legal/cookies.md`
- `.idealas/fases/13-legal/edad.md`
- `.idealas/fases/13-legal/pendientes-abogado.md`: preguntas concretas para el
  abogado.

## Listo cuando
- Cada dato de `datos.md` aparece en el Aviso con su finalidad.
- Cada tercero que recibe datos aparece como transferencia.
- Cada documento lleva la marca de borrador.
- Existe la lista de preguntas para el abogado.

## Trampas
- Publicar un borrador como definitivo.
- Copiar un Aviso de otro sitio: declara cosas que tu producto no hace (o calla
  las que sí).
- Prometer en el Aviso algo que el código no cumple (borrado, plazos): el Aviso
  es un contrato con el código.
