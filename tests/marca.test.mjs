// La marca de agua: el verificador acepta el componente tal cual y rechaza
// cada forma conocida de quitarlo o esconderlo; la exención sólo pasa firmada
// por un principal de la lista y atada al repo. Las llaves de estas pruebas
// se generan al vuelo y se borran: nunca se usa una llave real.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RAIZ } from "./util.mjs";
import { revisarHtml, revisarExencion, normalizarRepo, NAMESPACE } from "../skills/crear/scripts/marca/verificar.mjs";

const MARCA = join(RAIZ, "skills", "crear", "assets", "marca");
const SNIPPET = readFileSync(join(MARCA, "marca-idealas.html"), "utf8");
const pagina = (cuerpo) => `<!doctype html><html><head><title>x</title></head><body><main>hola</main><footer><p>© 2026</p>${cuerpo}</footer></body></html>`;

test("el fragmento oficial pasa", () => {
  assert.deepEqual(revisarHtml(pagina(SNIPPET)), []);
});

test("sin la marca, truena", () => {
  assert.match(revisarHtml(pagina("<p>nada</p>")).join(), /no hay un enlace con data-idealas-marca/);
});

test("cada forma de quitarla o esconderla truena", () => {
  const casos = {
    "otro href": SNIPPET.replace('href="https://idealas.mx"', 'href="https://otro.mx"'),
    "href que imita el dominio": SNIPPET.replace('href="https://idealas.mx"', 'href="https://idealas.mx.evil.com"'),
    nofollow: SNIPPET.replace("<a ", '<a rel="nofollow" '),
    hidden: SNIPPET.replace("<a ", "<a hidden "),
    "aria-hidden": SNIPPET.replace("<a ", '<a aria-hidden="true" '),
    "display none": SNIPPET.replace("opacity:1", "display:none"),
    "opacidad 0": SNIPPET.replace("opacity:1", "opacity:0"),
    "sin wordmark": SNIPPET.replace("data-idealas-wordmark", "data-otra-cosa"),
    "sin símbolo": SNIPPET.replace("data-idealas-simbolo", "data-otra-cosa"),
  };
  for (const [nombre, html] of Object.entries(casos)) {
    assert.notEqual(html, SNIPPET, `la mutación «${nombre}» no cambió nada`);
    assert.ok(revisarHtml(pagina(html)).length > 0, `«${nombre}» pasó y no debía`);
  }
});

test("un contenedor que la esconde también truena", () => {
  for (const envoltura of ['<div style="display:none">', "<div hidden>", '<section aria-hidden="true">']) {
    const cierre = envoltura.startsWith("<section") ? "</section>" : "</div>";
    assert.ok(revisarHtml(pagina(`${envoltura}${SNIPPET}${cierre}`)).length > 0, envoltura);
  }
  // Y un contenedor ya cerrado antes de la marca no cuenta.
  assert.deepEqual(revisarHtml(pagina(`<div hidden>x</div>${SNIPPET}`)), []);
});

test("el componente de React y el fragmento HTML llevan el mismo wordmark", () => {
  const tsx = readFileSync(join(MARCA, "MarcaIdealas.tsx"), "utf8");
  const svg = (t) => /<svg data-idealas-wordmark[\s\S]*?<\/svg>/.exec(t)?.[0];
  assert.ok(svg(SNIPPET));
  assert.equal(svg(tsx), svg(SNIPPET));
  assert.match(tsx, /href="https:\/\/idealas\.mx"/);
  assert.match(tsx, /data-idealas-marca="v1"/);
});

test("la lista de firmantes sólo admite a Nathan y Daniel", () => {
  const lineas = readFileSync(join(RAIZ, "skills", "crear", "scripts", "marca", "allowed_signers"), "utf8")
    .split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
  for (const l of lineas) {
    assert.match(l, new RegExp(`^(nkisel24|daarid) namespaces="${NAMESPACE}" (ssh-ed25519|ecdsa-sha2-\\S+|sk-\\S+|ssh-rsa) \\S+$`), l);
  }
});

test("normalizarRepo empareja ssh, https y credenciales", () => {
  const a = normalizarRepo("git@github.com:Acme/Proyecto.git");
  assert.equal(a, normalizarRepo("https://github.com/acme/proyecto"));
  assert.equal(a, normalizarRepo("https://token@github.com/acme/proyecto.git\n"));
});

// ---- La exención firmada, con llaves de prueba ------------------------------

const ssh = (args, input) => spawnSync("ssh-keygen", args, { input, encoding: "utf8" });

function escenario({ principal = "nkisel24", enLista = true, repo = "https://github.com/acme/proyecto", origen = repo } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "idealas-marca-"));
  const llave = join(dir, "llave");
  assert.equal(ssh(["-q", "-t", "ed25519", "-N", "", "-C", "prueba", "-f", llave]).status, 0, "no pude generar la llave de prueba");
  const pub = readFileSync(`${llave}.pub`, "utf8").trim().split(" ").slice(0, 2).join(" ");
  const firmantes = join(dir, "allowed_signers");
  writeFileSync(firmantes, enLista ? `${principal} namespaces="${NAMESPACE}" ${pub}\n` : "# vacía\n");
  const proyecto = join(dir, "proyecto");
  mkdirSync(join(proyecto, ".idealas"), { recursive: true });
  spawnSync("git", ["init", "-q", proyecto]);
  spawnSync("git", ["-C", proyecto, "remote", "add", "origin", origen]);
  const archivo = join(proyecto, ".idealas", "sin-marca");
  writeFileSync(archivo, `proyecto: prueba\nrepo: ${repo}\nfecha: 2026-10-24\naprueba: ${principal}\nporque: prueba\n`);
  assert.equal(ssh(["-Y", "sign", "-q", "-f", llave, "-n", NAMESPACE, archivo]).status, 0, "no pude firmar");
  return { dir, proyecto, firmantes, archivo };
}

test("exención firmada por un principal de la lista y atada al repo: pasa", (t) => {
  const e = escenario();
  t.after(() => rmSync(e.dir, { recursive: true, force: true }));
  assert.deepEqual(revisarExencion(e.proyecto, e.firmantes), { exenta: true, motivo: "exención firmada por nkisel24" });
});

test("exenciones que no deben pasar", (t) => {
  const casos = [
    ["el principal no está en la lista", escenario({ enLista: false })],
    ["es de otro repo", escenario({ repo: "https://github.com/acme/otro", origen: "https://github.com/acme/proyecto" })],
  ];
  const alterada = escenario();
  writeFileSync(alterada.archivo, readFileSync(alterada.archivo, "utf8").replace("porque: prueba", "porque: otra"));
  casos.push(["el archivo cambió después de firmar", alterada]);
  const sinFirma = escenario();
  rmSync(`${sinFirma.archivo}.sig`);
  casos.push(["no tiene firma", sinFirma]);
  t.after(() => { for (const [, e] of casos) rmSync(e.dir, { recursive: true, force: true }); });
  for (const [nombre, e] of casos) {
    const r = revisarExencion(e.proyecto, e.firmantes);
    assert.equal(r.exenta, false, `${nombre}: pasó (${r.motivo})`);
  }
});

test("con la lista real (vacía hoy) ninguna exención pasa", (t) => {
  const e = escenario();
  t.after(() => rmSync(e.dir, { recursive: true, force: true }));
  const real = join(RAIZ, "skills", "crear", "scripts", "marca", "allowed_signers");
  assert.equal(revisarExencion(e.proyecto, real).exenta, false);
});
