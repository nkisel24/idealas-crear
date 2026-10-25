# Fase 16 · Preparación del lanzamiento

## Para qué
Tener listo todo lo que no es el producto pero hace falta el día del
lanzamiento: copy final, SEO, analítica, correo, soporte, monitoreo y el video.

## Entra
- El producto probado (fase 15)
- `.idealas/fases/07-marca/voz.md`
- `.idealas/fases/13-legal/*` (ya revisado por el abogado)

## El plan que presentas
`.idealas/fases/16-lanzamiento/plan.md`:

```markdown
# Plan · Lanzamiento
- Copy final: <páginas>
- SEO: metadatos, schema, sitemap, OG
- Analítica: <herramienta sin terceros> y qué eventos
- Correo y soporte: <canales>
- Monitoreo: <qué se vigila y quién recibe las alertas>
- Video de lanzamiento: brag-slim, sobre datos demo
- Plan de lanzamiento: <canales y fecha>
```

## Pasos
1. **Copy final** de cada página con `idealas:copywriting` y
   `idealas:copy-editing`, en la voz de la marca.
2. **SEO**: título y descripción por página, `canonical` por página (nunca
   heredado del layout raíz), imagen OG, `sitemap.xml`, `robots.txt`, y datos
   estructurados con `idealas:schema`. Auditoría con `idealas:seo-audit`. Si hay
   app en tiendas, `idealas:aso`.
3. **Analítica sin terceros**: una herramienta sin cookies que se autohospede o
   que no comparta datos con terceros; si se usa una, va declarada en el Aviso.
   Sólo los eventos que responden a la métrica de éxito de la fase 05.
4. **Correo transaccional y soporte**: quién contesta, por dónde y en cuánto
   tiempo.
5. **Monitoreo**: salud del sitio, errores y a quién le llegan las alertas.
6. **Video de lanzamiento** con `idealas:brag-slim`: sobre **datos demo** (nada
   de datos de usuarios reales), revisado por una persona antes de publicarse, y
   con el **crédito de la música** si se usa la incluida (CC BY 4.0).
7. **Plan de lanzamiento** con `idealas:launch`: canales, mensajes, fecha.

## Herramientas
- `idealas:copywriting`, `idealas:copy-editing`, `idealas:seo-audit`,
  `idealas:schema`, `idealas:site-architecture`, `idealas:aso`,
  `idealas:launch`, `idealas:brag-slim`.
- MCP `chrome-devtools` para verificar SEO técnico.

## Sale
- `.idealas/fases/16-lanzamiento/seo.md`
- `.idealas/fases/16-lanzamiento/analitica.md`
- `.idealas/fases/16-lanzamiento/operacion.md`: correo, soporte, monitoreo.
- `.idealas/fases/16-lanzamiento/video/` (si se hace)
- `.idealas/fases/16-lanzamiento/plan-lanzamiento.md`

## Listo cuando
- Cada página pública tiene título, descripción, canonical y OG propios.
- La analítica está declarada en el Aviso o no recolecta datos personales.
- Hay alguien asignado a soporte y a las alertas.

## Trampas
- Analítica de terceros «por mientras»: queda para siempre y el Aviso no la dice.
- Un video con datos reales de usuarios.
- Lanzar sin que el Aviso tenga la revisión del abogado.
