#!/usr/bin/env node
// Verifica que las skills de terceros copiadas en skills/ sean exactamente las
// que se auditaron: cada archivo con el sha256 que guarda vendor/vendor.lock.json
// y ninguno de más. Un archivo cambiado, faltante o agregado es una skill que
// ya no es la auditada, así que sale 1.
//
// Uso: node scripts/vendor.mjs verificar
// Sin dependencias (Node 24). Lee bytes exactos: no normaliza fines de línea,
// por eso skills/** y vendor/** van con `-text` en .gitattributes.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK = join(RAIZ, "vendor", "vendor.lock.json");

function listar(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...listar(p));
    else out.push(p);
  }
  return out;
}

function sha256(ruta) {
  return createHash("sha256").update(readFileSync(ruta)).digest("hex");
}

export function verificar(raiz = RAIZ) {
  const lockRuta = join(raiz, "vendor", "vendor.lock.json");
  if (!existsSync(lockRuta)) return [`falta ${relative(raiz, lockRuta)}`];
  const lock = JSON.parse(readFileSync(lockRuta, "utf8"));
  if (lock.version !== 1 || !Array.isArray(lock.fuentes)) return ["vendor.lock.json con formato desconocido"];

  const fallas = [];
  for (const fuente of lock.fuentes) {
    if (!/^[0-9a-f]{40}$/.test(fuente.commit)) fallas.push(`${fuente.repo}: commit no es un sha de 40`);
    for (const [nombre, skill] of Object.entries(fuente.skills)) {
      const dir = join(raiz, "skills", nombre);
      if (!existsSync(dir)) {
        fallas.push(`${nombre}: falta la carpeta skills/${nombre}`);
        continue;
      }
      const esperados = skill.archivos;
      for (const [rel, hash] of Object.entries(esperados)) {
        const ruta = join(dir, rel);
        if (!existsSync(ruta)) fallas.push(`${nombre}/${rel}: falta`);
        else if (sha256(ruta) !== hash) fallas.push(`${nombre}/${rel}: cambió (sha256 distinto al auditado)`);
      }
      for (const ruta of listar(dir)) {
        const rel = relative(dir, ruta).split(sep).join("/");
        if (!(rel in esperados)) fallas.push(`${nombre}/${rel}: no está en el lock`);
      }
    }
  }
  return fallas;
}

const esPrincipal = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (esPrincipal) {
  const orden = process.argv[2];
  if (orden !== "verificar") {
    console.error("uso: node scripts/vendor.mjs verificar");
    process.exit(2);
  }
  const fallas = verificar();
  if (fallas.length) {
    console.error(`vendor: ${fallas.length} falla(s)`);
    for (const f of fallas) console.error(`  - ${f}`);
    process.exit(1);
  }
  const lock = JSON.parse(readFileSync(LOCK, "utf8"));
  const skills = lock.fuentes.reduce((n, f) => n + Object.keys(f.skills).length, 0);
  console.log(`vendor: ok (${lock.fuentes.length} fuentes, ${skills} skills, todo igual a lo auditado)`);
}
