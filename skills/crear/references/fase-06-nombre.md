# Fase 06 · Nombre

## Para qué
Elegir un nombre que se pueda usar: con dominio, con redes y sin un registro de
marca en conflicto. Un nombre que no se puede registrar se tira después del
logo.

## Entra
- `.idealas/fases/00-arranque/ficha.md` (si ya trae nombre, esta fase sólo lo
  verifica)
- `.idealas/fases/01-idea/idea.md`, `02-mercado/competencia.md` (nombres de la
  competencia, para no parecerse)

## El plan que presentas
`.idealas/fases/06-nombre/plan.md`:

```markdown
# Plan · Nombre
- Criterios: <tono, largo, idioma, qué evitar>
- Cuántos candidatos genero: <10–20>, y cuántos paso a verificación: <3–5>
- Verificaciones: dominio, redes (a mano), IMPI preliminar con clases de Niza <…>
- Aviso: la búsqueda en IMPI es preliminar; el dictamen es de un abogado
```

## Pasos
1. Acuerda los criterios con el usuario (tono, idioma, qué no puede sonar).
2. Genera 10–20 candidatos con su porqué. Descarta los que se parezcan a la
   competencia o tengan una lectura incómoda en español o en inglés.
3. Con el usuario, deja una lista corta de 3–5.
4. **Dominio.** Si está el conector de GoDaddy (`domains_check_availability`,
   `domains_suggest`), revisa `.mx`, `.com.mx` y `.com`. Si no, deja la lista y
   el usuario lo revisa en su registrador. Anota la fecha: la disponibilidad
   cambia.
5. **Redes.** A mano: el usuario revisa los handles en las redes que importan
   para el segmento. El motor no automatiza esto.
6. **IMPI, búsqueda preliminar.**
   - Determina las clases de Niza que aplican (p. ej. 9 software, 35 publicidad
     y negocios, 42 servicios tecnológicos) con su porqué.
   - Navega MARCia (`marcia.impi.gob.mx`) con el MCP de Playwright, una búsqueda
     a la vez, por denominación y por fonética, en esas clases.
   - Registra lo encontrado: denominación, clase, estado (registrada, en
     trámite, abandonada) y fecha de consulta.
   - **Siempre** escribe: «Búsqueda preliminar. No sustituye el dictamen de un
     abogado de propiedad industrial».
7. Recomienda uno con su riesgo y espera la elección del usuario.

## Herramientas
- Conector de GoDaddy (dominios), si está.
- MCP `playwright` para MARCia.
- `idealas:copywriting` para el porqué y el tono de cada nombre.

## Sale
- `.idealas/fases/06-nombre/candidatos.md`: lista larga con porqué.
- `.idealas/fases/06-nombre/verificacion.md`: tabla `Nombre | .mx | .com.mx | .com | Redes | IMPI (clases) | Riesgo`, con fecha.
- `.idealas/fases/06-nombre/decision.md`: el nombre elegido y su porqué.

## Listo cuando
- El nombre elegido tiene dominio disponible (o comprado) y la búsqueda IMPI
  preliminar registrada con fecha y aviso.
- El usuario eligió.

## Trampas
- Comprar el dominio es una compra: la hace el usuario, no el motor.
- MARCia cambia su interfaz; si Playwright no puede, deja las búsquedas escritas
  para que el usuario las haga a mano.
- «No salió nada en IMPI» no significa «se puede registrar».
- Un nombre que funciona sólo en inglés limita al segmento mexicano.
