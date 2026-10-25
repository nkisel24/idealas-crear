// Los manifiestos del plugin: versiones exactas en todo lo que se lanza con
// npx (con @latest, cada arranque bajaría código sin auditar) y las mismas
// dependencias que instala la revisión de arranque.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./util.mjs";
import { DEPENDENCIAS } from "../skills/crear/scripts/preflight.mjs";

const json = (ruta) => JSON.parse(readFileSync(join(RAIZ, ruta), "utf8"));

test("plugin.json: se llama idealas y declara las dependencias de la revisión", () => {
  const p = json(".claude-plugin/plugin.json");
  assert.equal(p.name, "idealas");
  assert.match(p.version, /^\d+\.\d+\.\d+$/);
  assert.deepEqual([...p.dependencies].sort(), [...DEPENDENCIAS].sort());
});

test("marketplace.json: publica este plugin desde la raíz y permite las dependencias oficiales", () => {
  const m = json(".claude-plugin/marketplace.json");
  assert.equal(m.name, "idealas");
  assert.deepEqual(m.plugins.map((x) => [x.name, x.source]), [["idealas", "./"]]);
  assert.deepEqual(m.allowCrossMarketplaceDependenciesOn, ["claude-plugins-official"]);
});

test(".mcp.json: todo paquete de npx con versión exacta y todo remoto por https", () => {
  const { mcpServers } = json(".mcp.json");
  assert.ok(Object.keys(mcpServers).length >= 8);
  for (const [nombre, s] of Object.entries(mcpServers)) {
    if (s.command) {
      assert.equal(s.command, "npx", nombre);
      const paquete = s.args.find((a) => !a.startsWith("-"));
      assert.match(paquete, /^(@[\w.-]+\/)?[\w.-]+@\d+\.\d+\.\d+$/, `${nombre}: ${paquete} no lleva versión exacta`);
    } else {
      assert.equal(s.type, "http", nombre);
      assert.match(s.url, /^https:\/\//, nombre);
    }
  }
});

test(".mcp.json: la telemetría que se puede apagar va apagada", () => {
  const { mcpServers: m } = json(".mcp.json");
  assert.ok(m["chrome-devtools"].args.includes("--no-usage-statistics"));
  assert.ok(m["chrome-devtools"].args.includes("--no-performance-crux"));
  assert.equal(m["next-devtools"].env.NEXT_TELEMETRY_DISABLED, "1");
});
