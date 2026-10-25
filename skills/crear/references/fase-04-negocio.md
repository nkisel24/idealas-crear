# Fase 04 · Modelo de negocio y precio

## Para qué
Saber cómo cobra el producto, cuánto cuesta operarlo y qué números mínimos
tiene que alcanzar. Sin esto no hay sociedad que proponer: Idealas entra con
participación o con un porcentaje de ingresos.

## Entra
- `.idealas/fases/01-idea/lean-canvas.md`
- `.idealas/fases/02-mercado/competencia.md` (precios públicos), `mercado.md`
- `.idealas/fases/03-validacion/predicciones.md` (disposición a pagar)

## El plan que presentas
`.idealas/fases/04-negocio/plan.md`:

```markdown
# Plan · Negocio
- Modelo de ingresos a evaluar: <suscripción | comisión | pago único | freemium | B2B>
- Precio a proponer y de dónde sale: <competencia, validación>
- Costos a estimar: <infra, APIs de IA, correo/WhatsApp, pasarela, soporte>
- Números a calcular: <punto de equilibrio, margen por cliente>
```

## Pasos
1. Elige el modelo de ingresos (máximo dos a comparar) con su porqué.
2. **Precio.** Parte de lo que paga hoy el segmento por el sustituto y de lo que
   dijo en la validación. Usa `idealas:pricing`. Precios en MXN, con IVA aparte
   y explícito.
3. **Costos de operar**, por mes y por cliente activo:
   - infraestructura (hospedaje, base, almacenamiento);
   - APIs de IA: tokens estimados por uso × precio público vigente (anota la
     fecha del precio);
   - correo y WhatsApp transaccionales;
   - comisión de la pasarela de pago (en México, típicamente un porcentaje más
     una cuota fija por transacción; usa la tarifa pública vigente);
   - soporte humano.
4. **Números mínimos:** margen por cliente, clientes para cubrir costos fijos,
   y con cuántos clientes empieza a valer la pena para el equipo.
5. Escribe los supuestos de cada número. Una hoja con fórmulas ayuda: si el
   usuario la quiere, usa la skill `xlsx`.

## Herramientas
- `idealas:pricing`.
- `xlsx` para el modelo con fórmulas, si está disponible.
- `finance:*` sólo si el usuario lo pide.

## Sale
- `.idealas/fases/04-negocio/modelo.md`: modelo, precio, costos y números.
- `.idealas/fases/04-negocio/supuestos-numeros.md`
- `.idealas/fases/04-negocio/modelo.xlsx` (opcional)

## Listo cuando
- Cada costo tiene fuente o supuesto explícito.
- El punto de equilibrio está calculado con números, no descrito.
- Hay una frase que diga si el negocio se sostiene, no se sostiene o no se sabe.

## Trampas
- Olvidar el costo de la IA por uso: es el que más crece con los usuarios.
- Precios en dólares sin convertir, o sin IVA.
- No es asesoría financiera ni fiscal: es un modelo para decidir si seguir.
