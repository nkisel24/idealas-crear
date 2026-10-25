#!/usr/bin/env node
// Verifica la marca de agua de Idealas en lo que publica un proyecto del motor.
//
// Por qué existe: toda interfaz pública que sale de /idealas:crear lleva en el
// pie el wordmark de Idealas con su enlace, y sólo Nathan o Daniel pueden
// autorizar quitarlo. La autorización es un archivo firmado con su llave SSH
// (`.idealas/sin-marca` + `.idealas/sin-marca.sig`); este script la comprueba
// con `ssh-keygen -Y verify` contra la lista de firmantes que viaja con él.
//
// Lo que garantiza, dicho exacto: si el proyecto corre este script en sus
// pruebas o en su CI, una página sin marca (o con la marca escondida en el
// HTML) truena salvo que exista una exención firmada por uno de los dos y
// atada a ESTE repositorio. Lo que NO garantiza: quien tenga escritura en el
// repo del proyecto puede borrar la prueba. Es un candado que avisa, no DRM;
// el motor además revisa la marca cada vez que corre en el proyecto.
//
// Uso:
//   node verificar.mjs --dir <carpeta con .html> [--raiz <repo>]
//   node verificar.mjs --url <https://…> [--url …] [--raiz <repo>]
//   (--firmantes <archivo> sólo para las pruebas del propio motor)
// Sale 0 si todo cuadra, 1 si algo falla, 2 si se usó mal.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const MARCA_URL = "https://idealas.mx";
export const NAMESPACE = "idealas-sin-marca";
const AQUI = dirname(fileURLToPath(import.meta.url));
const FIRMANTES_DEFAULT = join(AQUI, "allowed_signers");

function args(argv) {
  const out = { dir: [], url: [], raiz: process.cwd(), firmantes: FIRMANTES_DEFAULT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const v = argv[i + 1];
    if (a === "--dir" && v) { out.dir.push(v); i++; }
    else if (a === "--url" && v) { out.url.push(v); i++; }
    else if (a === "--raiz" && v) { out.raiz = v; i++; }
    else if (a === "--firmantes" && v) { out.firmantes = v; i++; }
    else return null;
  }
  return out;
}

// ---- La exención firmada ----------------------------------------------------

/** Lee `clave: valor` por renglón. */
export function leerCampos(texto) {
  const campos = {};
  for (const linea of texto.split(/\r?\n/)) {
    const m = /^([a-z]+):\s*(.+?)\s*$/.exec(linea);
    if (m) campos[m[1]] = m[2];
  }
  return campos;
}

/** El remoto `origin` normalizado (sin credenciales, sin .git, en minúsculas). */
export function normalizarRepo(url) {
  return url
    .trim()
    .replace(/^git@([^:]+):/, "https://$1/")
    .replace(/^https?:\/\/[^@/]+@/, "https://")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

function origenDe(raiz) {
  const r = spawnSync("git", ["-C", raiz, "remote", "get-url", "origin"], { encoding: "utf8" });
  return r.status === 0 ? normalizarRepo(r.stdout) : null;
}

/**
 * ¿Hay una exención válida? Devuelve { exenta, motivo }.
 * Falla cerrado: cualquier duda (sin firma, sin firmante, sin origin, otro
 * repo) es «no exenta».
 */
export function revisarExencion(raiz, firmantes) {
  const archivo = join(raiz, ".idealas", "sin-marca");
  const firma = `${archivo}.sig`;
  if (!existsSync(archivo)) return { exenta: false, motivo: "sin exención" };
  if (!existsSync(firma)) return { exenta: false, motivo: "la exención no tiene firma (.idealas/sin-marca.sig)" };
  const texto = readFileSync(archivo, "utf8");
  const campos = leerCampos(texto);
  if (!campos.aprueba || !campos.repo) {
    return { exenta: false, motivo: "la exención necesita los campos «aprueba» y «repo»" };
  }
  const origen = origenDe(raiz);
  if (!origen) return { exenta: false, motivo: "no pude leer el remoto origin para atar la exención al repo" };
  if (normalizarRepo(campos.repo) !== origen) {
    return { exenta: false, motivo: `la exención es de otro repo (${campos.repo}), no de ${origen}` };
  }
  if (!existsSync(firmantes) || !/\S/.test(readFileSync(firmantes, "utf8").replace(/^#.*$/gm, ""))) {
    return { exenta: false, motivo: "la lista de firmantes está vacía: nadie ha registrado su llave todavía" };
  }
  const r = spawnSync(
    "ssh-keygen",
    ["-Y", "verify", "-f", firmantes, "-I", campos.aprueba, "-n", NAMESPACE, "-s", firma],
    { input: readFileSync(archivo), encoding: "utf8" },
  );
  if (r.error) return { exenta: false, motivo: `no pude correr ssh-keygen (${r.error.code})` };
  if (r.status !== 0) return { exenta: false, motivo: `la firma no es válida para «${campos.aprueba}»` };
  return { exenta: true, motivo: `exención firmada por ${campos.aprueba}` };
}

// ---- La marca en el HTML ----------------------------------------------------

const ESCONDIDA = [
  /\bhidden\b(?![-\w])/i,
  /aria-hidden\s*=\s*["']?true/i,
  /display\s*:\s*none/i,
  /visibility\s*:\s*hidden/i,
  /opacity\s*:\s*0(?:\.0+)?(?![.\d])/i,
];

/** Atributos del elemento de apertura (`<a …>`). */
function atributos(etiqueta) {
  return etiqueta.replace(/^<\w+/, "").replace(/\/?>$/, "");
}

/**
 * Revisa un documento HTML. Devuelve la lista de problemas (vacía = bien).
 * Estático a propósito: lo visual (que se vea, tamaño, contraste) lo mide la
 * prueba de navegador de la fase 15.
 */
export function revisarHtml(html) {
  const problemas = [];
  const m = /<a\b[^>]*\bdata-idealas-marca\b[^>]*>([\s\S]*?)<\/a>/i.exec(html);
  if (!m) return ["no hay un enlace con data-idealas-marca"];
  const apertura = m[0].slice(0, m[0].indexOf(">") + 1);
  const attrs = atributos(apertura);
  const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
  if (!href || !(href === MARCA_URL || href.startsWith(`${MARCA_URL}/`) || href.startsWith(`${MARCA_URL}?`))) {
    problemas.push(`el enlace de la marca no va a ${MARCA_URL} (href=${href ?? "∅"})`);
  }
  if (/\brel\s*=\s*["'][^"']*nofollow/i.test(attrs)) problemas.push("el enlace de la marca lleva rel=nofollow");
  for (const patron of ESCONDIDA) {
    if (patron.test(attrs)) problemas.push(`la marca está escondida (${patron.source})`);
  }
  const dentro = m[1];
  if (!/<svg\b[^>]*\bdata-idealas-wordmark\b/i.test(dentro)) problemas.push("falta el wordmark (svg con data-idealas-wordmark)");
  if (!/\bdata-idealas-simbolo\b/i.test(dentro)) problemas.push("falta el símbolo (data-idealas-simbolo)");
  // Un ancestro con hidden/display:none la esconde igual: se revisa el tramo
  // abierto antes de la marca, etiqueta por etiqueta.
  const antes = html.slice(0, m.index);
  const abiertos = [];
  for (const t of antes.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    const nombre = t[1].toLowerCase();
    if (t[0].startsWith("</")) {
      const i = abiertos.map((x) => x.nombre).lastIndexOf(nombre);
      if (i >= 0) abiertos.splice(i);
    } else if (!/\/>$/.test(t[0]) && !["br", "img", "meta", "link", "input", "hr", "source", "path", "circle"].includes(nombre)) {
      abiertos.push({ nombre, attrs: atributos(t[0]) });
    }
  }
  for (const a of abiertos) {
    if (["html", "head"].includes(a.nombre)) continue;
    for (const patron of ESCONDIDA) {
      if (patron.test(a.attrs)) problemas.push(`un contenedor <${a.nombre}> esconde la marca (${patron.source})`);
    }
  }
  return problemas;
}

function htmlsEn(dir) {
  const out = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    const st = statSync(ruta);
    if (st.isDirectory()) out.push(...htmlsEn(ruta));
    else if (nombre.endsWith(".html")) out.push(ruta);
  }
  return out;
}

async function main() {
  const op = args(process.argv.slice(2));
  if (!op || (op.dir.length === 0 && op.url.length === 0)) {
    console.error("uso: node verificar.mjs --dir <carpeta> | --url <https://…> [--raiz <repo>]");
    process.exit(2);
  }
  const raiz = resolve(op.raiz);
  const exencion = revisarExencion(raiz, op.firmantes);
  if (exencion.exenta) {
    console.log(`marca: exenta — ${exencion.motivo}`);
    process.exit(0);
  }
  if (exencion.motivo !== "sin exención") console.error(`marca: exención rechazada — ${exencion.motivo}`);

  const paginas = [];
  for (const d of op.dir) {
    const archivos = htmlsEn(resolve(d));
    if (archivos.length === 0) { console.error(`marca: FALLA — no hay .html en ${d}`); process.exit(1); }
    for (const f of archivos) paginas.push({ donde: f, html: readFileSync(f, "utf8") });
  }
  for (const u of op.url) {
    const r = await fetch(u, { redirect: "follow" });
    if (!r.ok) { console.error(`marca: FALLA — ${u} respondió ${r.status}`); process.exit(1); }
    paginas.push({ donde: u, html: await r.text() });
  }
  let fallas = 0;
  for (const p of paginas) {
    const problemas = revisarHtml(p.html);
    if (problemas.length === 0) console.log(`ok     ${p.donde}`);
    else {
      fallas++;
      for (const x of problemas) console.error(`FALLA  ${p.donde}: ${x}`);
    }
  }
  if (fallas > 0) {
    console.error(`marca: ${fallas} de ${paginas.length} páginas sin la marca de Idealas. Quitarla requiere una exención firmada por Nathan o Daniel (ver references/marca-de-agua.md).`);
    process.exit(1);
  }
  console.log(`marca: ${paginas.length} páginas con la marca de Idealas`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(`marca: error — ${e.message}`); process.exit(1); });
}
