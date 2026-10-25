// La revisión de arranque con un ejecutor falso: instala sola lo auditado,
// nunca lo que pide llave, y se detiene si lo copiado no es lo auditado.

import { test } from "node:test";
import assert from "node:assert/strict";
import { revisar, esMasNueva, DEPENDENCIAS } from "../skills/crear/scripts/preflight.mjs";

const ok = (stdout = "") => ({ ok: true, stdout, salida: stdout, falta: false });
const falla = (salida = "error") => ({ ok: false, stdout: "", salida, falta: false });

/** Máquina falsa: responde según el comando y anota lo que se corrió. */
function maquina({ plugins = DEPENDENCIAS.map((id) => ({ id, version: "1", enabled: true })), mcps = ["context7", "21st"], vendorOk = true, claude = true, publicada = "0.1.0" } = {}) {
  const corridas = [];
  const correr = (cmd, args) => {
    corridas.push([cmd, ...args].join(" "));
    if (args[1] === "verificar") return vendorOk ? ok("vendor: ok") : falla("cambió skills/animate/SKILL.md");
    if (cmd === "claude" && !claude) return { ok: false, stdout: "", salida: "", falta: true };
    if (cmd === "claude" && args[0] === "--version") return ok("2.1.229 (Claude Code)");
    if (cmd === "claude" && args.join(" ") === "plugin list --json") return ok(JSON.stringify(plugins));
    if (cmd === "claude" && args.join(" ") === "mcp list") return ok(mcps.map((m) => `${m}: algo - ✔ Connected`).join("\n"));
    if (cmd === "gh" && args[0] === "api") return ok(Buffer.from(JSON.stringify({ version: publicada })).toString("base64"));
    if (["py", "python3", "python"].includes(cmd)) return ok("Python 3.13.1");
    return ok("");
  };
  return { correr, corridas };
}
const estado = (res, id) => res.find((r) => r.id === id)?.estado;

test("todo en su lugar: nada que instalar", () => {
  const m = maquina();
  const res = revisar({ correr: m.correr, proyecto: "/no/existe" });
  assert.ok(res.every((r) => ["ok", "aviso"].includes(r.estado)), JSON.stringify(res.filter((r) => !["ok", "aviso"].includes(r.estado))));
  assert.ok(!m.corridas.some((c) => / install | enable | mcp add /.test(` ${c} `)));
});

test("falta una dependencia oficial: la instala sola", () => {
  const m = maquina({ plugins: [{ id: DEPENDENCIAS[0], version: "1", enabled: true }, { id: DEPENDENCIAS[1], version: "1", enabled: false }] });
  const res = revisar({ correr: m.correr, proyecto: "/no/existe" });
  assert.ok(m.corridas.includes(`claude plugin enable ${DEPENDENCIAS[1]}`));
  assert.ok(m.corridas.includes(`claude plugin install ${DEPENDENCIAS[2]}`));
  assert.equal(estado(res, DEPENDENCIAS[2]), "instalado");
});

test("falta context7: lo agrega; falta 21st: lo pide (necesita llave)", () => {
  const m = maquina({ mcps: [] });
  const res = revisar({ correr: m.correr, proyecto: "/no/existe" });
  assert.ok(m.corridas.includes("claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp@latest"));
  assert.equal(estado(res, "mcp:21st"), "humano");
  assert.ok(!m.corridas.some((c) => c.includes("21st.dev")), "nunca debe agregar 21st sin la llave del usuario");
});

test("--sin-instalar no toca nada", () => {
  const m = maquina({ plugins: [], mcps: [], publicada: "9.0.0" });
  revisar({ correr: m.correr, instalar: false, proyecto: "/no/existe" });
  assert.deepEqual(m.corridas.filter((c) => / install | enable | mcp add | update /.test(` ${c} `)), []);
});

test("lo copiado no es lo auditado: bloquea", () => {
  const res = revisar({ correr: maquina({ vendorOk: false }).correr, proyecto: "/no/existe" });
  assert.equal(estado(res, "skills-copiadas"), "bloquea");
});

test("sin Claude Code: bloquea y no sigue", () => {
  const res = revisar({ correr: maquina({ claude: false }).correr, proyecto: "/no/existe" });
  assert.equal(estado(res, "claude"), "bloquea");
  assert.equal(res.at(-1).id, "claude");
});

test("hay versión nueva del plugin: actualiza", () => {
  const m = maquina({ publicada: "9.0.0" });
  const res = revisar({ correr: m.correr, proyecto: "/no/existe" });
  assert.ok(m.corridas.includes("claude plugin marketplace update idealas"));
  assert.ok(m.corridas.includes("claude plugin update idealas@idealas"));
  assert.equal(estado(res, "actualizacion"), "instalado");
});

test("esMasNueva compara por números", () => {
  assert.equal(esMasNueva("0.10.0", "0.9.0"), true);
  assert.equal(esMasNueva("0.1.0", "0.1.0"), false);
  assert.equal(esMasNueva("1.0", "1.0.1"), false);
});
