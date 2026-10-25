// Lo copiado es exactamente lo auditado (el lock), y el verificador lo
// detecta cuando no: un byte de más o un archivo que el lock no conoce.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RAIZ } from "./util.mjs";

const verificar = (raiz) => spawnSync(process.execPath, [join(raiz, "scripts", "vendor.mjs"), "verificar"], { encoding: "utf8" });

function copia() {
  const dir = mkdtempSync(join(tmpdir(), "idealas-vendor-"));
  for (const d of ["skills", "vendor", "scripts"]) cpSync(join(RAIZ, d), join(dir, d), { recursive: true });
  return dir;
}

test("el árbol del repo es idéntico al lock", () => {
  const r = verificar(RAIZ);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test("un byte de más en una skill copiada: truena", (t) => {
  const dir = copia();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  appendFileSync(join(dir, "skills", "animate", "SKILL.md"), " ");
  assert.equal(verificar(dir).status, 1);
});

test("un archivo que el lock no conoce: truena", (t) => {
  const dir = copia();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, "skills", "brandkit", "extra.md"), "x");
  assert.equal(verificar(dir).status, 1);
});
