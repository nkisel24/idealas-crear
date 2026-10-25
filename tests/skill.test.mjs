// El orquestador, sus guías y lo copiado tienen que estar de acuerdo: si una
// guía nombra `idealas:<skill>` y esa skill no viene en el plugin, Claude la
// buscaría y no la encontraría a media fase.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./util.mjs";

const CREAR = join(RAIZ, "skills", "crear");
const REFS = join(CREAR, "references");
const SKILL = readFileSync(join(CREAR, "SKILL.md"), "utf8");
const guias = readdirSync(REFS).filter((f) => f.endsWith(".md"));
const textos = [SKILL, ...guias.map((g) => readFileSync(join(REFS, g), "utf8"))];

test("el frontmatter declara /idealas:crear sólo a mano", () => {
  const fm = /^---\n([\s\S]*?)\n---/.exec(SKILL.replace(/\r\n/g, "\n"))?.[1] ?? "";
  assert.match(fm, /^name: crear$/m);
  assert.match(fm, /^disable-model-invocation: true$/m);
  assert.match(fm, /^description: .{40,}/m);
});

test("SKILL.md cabe en el límite recomendado (500 líneas)", () => {
  assert.ok(SKILL.split("\n").length < 500);
});

test("cada guía que cita SKILL.md existe", () => {
  const citadas = [...SKILL.matchAll(/references\/([\w-]+\.md)/g)].map((m) => m[1]);
  assert.ok(citadas.length >= 21, `sólo ${citadas.length} guías citadas`);
  for (const c of citadas) assert.ok(existsSync(join(REFS, c)), `falta references/${c}`);
});

test("cada guía de fase está en la tabla de SKILL.md", () => {
  for (const g of guias.filter((x) => /^(fase-|compuerta)/.test(x))) {
    assert.ok(SKILL.includes(`references/${g}`), `${g} no está en la tabla de fases`);
  }
});

test("todo `idealas:<skill>` que se nombra viene en el plugin", () => {
  const nombradas = new Set();
  for (const t of textos) for (const m of t.matchAll(/`idealas:([a-z0-9-]+)`/g)) nombradas.add(m[1]);
  assert.ok(nombradas.size > 20, `sólo ${nombradas.size} skills nombradas: ¿cambió el formato?`);
  const faltan = [...nombradas].filter((n) => n !== "crear" && !existsSync(join(RAIZ, "skills", n, "SKILL.md")));
  assert.deepEqual(faltan, [], `las guías nombran skills que no vienen: ${faltan.join(", ")}`);
});

test("sin voseo en lo que escribimos nosotros", () => {
  // Fronteras Unicode: con \b, «Decídelo» (tuteo) casaba como «decí».
  const voseo = /(?<!\p{L})(querés|tenés|podés|sabés|hacé|fijate|revisá|mirá|decí|vos)(?!\p{L})/iu;
  for (const [i, t] of textos.entries()) assert.doesNotMatch(t, voseo, `voseo en ${i === 0 ? "SKILL.md" : guias[i - 1]}`);
});
