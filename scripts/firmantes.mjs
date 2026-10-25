#!/usr/bin/env node
// Reescribe skills/crear/scripts/marca/allowed_signers con las llaves de FIRMA
// que Nathan (nkisel24) y Daniel (daarid) publicaron en GitHub
// (Settings → SSH and GPG keys → New SSH key → Key type: Signing Key).
//
// Por qué así: la lista decide quién puede autorizar quitar la marca de agua,
// así que sale de una fuente que sólo ellos controlan (su cuenta de GitHub) y
// el cambio entra por PR. Las llaves son públicas: aquí no viaja ningún
// secreto. Necesita `gh` autenticado.
//
// Uso: node scripts/firmantes.mjs        (escribe el archivo)
//      node scripts/firmantes.mjs --ver  (sólo imprime lo que escribiría)

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIRMANTES = ["nkisel24", "daarid"];
const NAMESPACE = "idealas-sin-marca";
const DESTINO = join(dirname(fileURLToPath(import.meta.url)), "..", "skills", "crear", "scripts", "marca", "allowed_signers");

const ENCABEZADO = `# Quién puede autorizar que un proyecto quite la marca de agua de Idealas.
# Formato de ssh-keygen (ALLOWED SIGNERS): <principal> namespaces="${NAMESPACE}" <llave pública>
# Sólo Nathan (nkisel24) y Daniel (daarid). Vacía = nadie puede quitarla.
# NO se edita a mano: la escribe \`node scripts/firmantes.mjs\` desde las llaves
# de firma que cada quien publica en GitHub, y entra por PR que mergea Nathan.
`;

function llavesDe(usuario) {
  const r = spawnSync("gh", ["api", `users/${usuario}/ssh_signing_keys`, "--jq", ".[].key"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`gh api falló para ${usuario}: ${r.stderr.trim()}`);
  return r.stdout.split(/\r?\n/).map((l) => l.trim()).filter((l) => /^(ssh-ed25519|ecdsa-sha2-\S+|sk-\S+|ssh-rsa) \S+/.test(l));
}

const lineas = [];
for (const u of FIRMANTES) {
  const llaves = llavesDe(u);
  if (llaves.length === 0) console.error(`aviso: ${u} no tiene llaves de firma en GitHub; no podrá autorizar`);
  for (const k of llaves) lineas.push(`${u} namespaces="${NAMESPACE}" ${k.split(" ").slice(0, 2).join(" ")}`);
}
const contenido = ENCABEZADO + lineas.map((l) => `${l}\n`).join("");
if (process.argv.includes("--ver")) process.stdout.write(contenido);
else {
  writeFileSync(DESTINO, contenido);
  console.log(`firmantes: ${lineas.length} llaves escritas en ${DESTINO}`);
}
