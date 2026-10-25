# Fase 12 · Plan técnico

## Para qué
Decidir dónde y cómo se construye para que el producto se vea igual o mejor que
el diseño y funcione en producción: stack, hospedaje, datos, auth, costos y
riesgos.

## Entra
- `.idealas/fases/00-arranque/ficha.md` (camino de Idealas)
- `.idealas/fases/05-mvp/alcance.md`
- `.idealas/fases/11-design-system/*`
- `.idealas/fases/04-negocio/modelo.md` (costos)

## El plan que presentas
`.idealas/fases/12-plan-tecnico/plan.md`:

```markdown
# Plan · Plan técnico
- Stack: <framework, lenguaje, estilos, base de datos, auth>
- Hospedaje: <Idealas | cuenta del fundador> y por qué
- Fidelidad al diseño: qué APIs web y técnicas lo garantizan
- Datos personales que guarda: <lista> → fase 13
- Costos mensuales estimados
- Riesgos técnicos y cómo se mitigan
```

## Pasos
1. **Stack.** Por defecto, el de Idealas: Next.js (App Router) + React +
   TypeScript estricto, Tailwind + el design system de la fase 11, Supabase
   (Postgres, Auth, Storage) con RLS. Si el producto es móvil, React Native con
   Expo. Cambia el default sólo con porqué.
2. **Hospedaje.** Dos opciones, decide con el equipo:
   - **En Idealas** (camino de la incubadora: «hospedada por nosotros mientras
     seamos socios»), en la infraestructura de Idealas.
   - **En la cuenta del fundador** (Vercel, Netlify, Railway u otro), si así se
     acordó.
3. **Fidelidad al diseño.** Revisa con `idealas:modern-web-guidance` qué APIs
   web (View Transitions, container queries, `@property`, etc.) tienen soporte
   Baseline y cuáles requieren respaldo. Si es Next, el MCP `next-devtools` lee
   errores y rutas del servidor de desarrollo (telemetría apagada).
4. **Datos.** Esquema inicial, qué datos personales guarda, con qué base legal y
   con qué retención. Toda tabla con datos de usuarios lleva RLS; usa las skills
   de Supabase. Esta lista alimenta la fase 13.
5. **Integraciones** (correo, WhatsApp, pagos, IA): cuál, por qué, qué dato sale
   a ese tercero y cuánto cuesta.
6. **Costos** mensuales por concepto, contrastados con la fase 04.
7. **Riesgos** técnicos y su mitigación.

## Herramientas
- `idealas:modern-web-guidance`, `idealas:web-design-guidelines`.
- MCP `next-devtools` (si es Next), MCP `context7` para documentación vigente.
- `idealas:supabase` y `idealas:supabase-postgres-best-practices` para esquema y RLS.

## Sale
- `.idealas/fases/12-plan-tecnico/arquitectura.md`: stack, hospedaje, diagrama.
- `.idealas/fases/12-plan-tecnico/datos.md`: esquema y datos personales.
- `.idealas/fases/12-plan-tecnico/costos.md`
- `.idealas/fases/12-plan-tecnico/riesgos.md`

## Listo cuando
- Cada decisión de stack tiene su porqué.
- La lista de datos personales está completa (la fase 13 la usa tal cual).
- El costo mensual cuadra con el modelo de la fase 04 o se señala la diferencia.

## Trampas
- Elegir un stack por moda: el default existe para no decidir de cero.
- Integraciones que mandan datos personales a un tercero sin que el Aviso lo
  diga.
- La decisión de hospedar en Idealas no la toma el motor: la toma el equipo.
