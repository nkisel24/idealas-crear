#!/usr/bin/env node
// Revisión de arranque de /idealas:crear: comprueba que esté todo lo que usa
// el motor y, si falta algo, lo instala.
//
// Decisión de Nathan (2026-10-24): instala SOLO, sin preguntar, lo que está
// fijado a una versión auditada (las dependencias oficiales del plugin, el
// context7 del inventario). Para lo que necesita una cuenta o una llave (21st)
// o software del sistema (Python, Chrome) no instala: dice qué falta y cómo.
// Lo que viene DENTRO del plugin (skills copiadas, MCPs con versión fija) ya
// llegó al instalar el plugin; aquí sólo se verifica que no lo hayan tocado.
//
// Uso:  node preflight.mjs [--sin-instalar] [--json] [--proyecto <ruta>]
// Sale 1 sólo si algo BLOQUEA (las skills copiadas no son las auditadas, o
// falta Claude Code); lo demás son avisos y el motor sigue con lo que hay.

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const PLUGIN = resolve(AQUI, "..", "..", "..");
export const REPO_PLUGIN = "nkisel24/idealas-crear";

export const DEPENDENCIAS = [
  "claude-security@claude-plugins-official",
  "playground@claude-plugins-official",
  "security-guidance@claude-plugins-official",
];

/** MCPs de usuario que el motor espera. `instalar` = auditado e instalable solo. */
export const MCP_USUARIO = {
  context7: {
    instalar: ["mcp", "add", "--scope", "user", "context7", "--", "npx", "-y", "@upstash/context7-mcp@latest"],
    para: "documentación de librerías (fases 12 y 14)",
  },
  "21st": {
    humano:
      "21st necesita tu llave personal (plan gratis: 2 descargas de código al día). Sácala de https://21st.dev/mcp con el botón de copiar y corre en tu terminal: " +
      'claude mcp add --scope user --transport http 21st https://21st.dev/api/mcp --header "x-api-key: <tu-llave>"',
    para: "componentes e inspiración (fases 7, 10 y 14)",
  },
};

/**
 * Ejecutor real. Sin shell: claude, git, gh y ssh-keygen son ejecutables. La
 * excepción es Windows con Claude Code instalado por npm (`claude.cmd`, que no
 * se lanza sin shell): ahí se reintenta una vez por cmd.exe, con cada
 * argumento entre comillas (son constantes de este script, no texto libre).
 */
export function correrReal(cmd, args, { timeout = 120_000 } = {}) {
  let r = spawnSync(cmd, args, { encoding: "utf8", timeout, windowsHide: true });
  if (r.error?.code === "ENOENT" && process.platform === "win32" && cmd === "claude") {
    const linea = [cmd, ...args].map((a) => (/^[\w@./:=-]+$/.test(a) ? a : `"${a.replace(/"/g, '\\"')}"`)).join(" ");
    r = spawnSync(linea, { encoding: "utf8", timeout, windowsHide: true, shell: true });
  }
  return {
    ok: r.status === 0,
    stdout: r.stdout ?? "",
    salida: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim(),
    falta: r.error?.code === "ENOENT",
  };
}

const sha256 = (ruta) => createHash("sha256").update(readFileSync(ruta)).digest("hex");

/** «1.2.3» > «1.2.0»: compara por números, no por texto. */
export function esMasNueva(remota, local) {
  const a = remota.split(".").map(Number);
  const b = local.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) return x > y;
  }
  return false;
}

/**
 * Corre la revisión. `correr` se inyecta para poder probarla sin tocar la
 * máquina. Devuelve la lista de resultados { id, estado, detalle }, con
 * estado ∈ ok | instalado | aviso | humano | bloquea.
 */
export function revisar({ correr = correrReal, instalar = true, proyecto = process.cwd(), plugin = PLUGIN } = {}) {
  const res = [];
  const anota = (id, estado, detalle) => res.push({ id, estado, detalle });

  // 1. Node: los scripts de taste v2 piden 22; el equipo usa 24.
  const mayor = Number(process.versions.node.split(".")[0]);
  if (mayor < 22) anota("node", "humano", `Node ${process.versions.node}: instala Node 24 LTS (los scripts del motor piden 22 o más)`);
  else anota("node", mayor < 24 ? "aviso" : "ok", `Node ${process.versions.node}${mayor < 24 ? " (el equipo usa 24)" : ""}`);

  // 2. Integridad de lo copiado: si no es lo auditado, el motor no arranca.
  const vendor = join(plugin, "scripts", "vendor.mjs");
  if (!existsSync(vendor)) anota("skills-copiadas", "bloquea", "falta scripts/vendor.mjs en el plugin");
  else {
    const v = correr(process.execPath, [vendor, "verificar"]);
    anota("skills-copiadas", v.ok ? "ok" : "bloquea", v.ok ? "idénticas a lo auditado" : `no son las auditadas:\n${v.salida}`);
  }

  // 3. Claude Code.
  const cli = correr("claude", ["--version"]);
  if (!cli.ok) {
    anota("claude", "bloquea", cli.falta ? "no encuentro la CLI `claude` en el PATH" : `claude --version falló: ${cli.salida}`);
    return res;
  }
  anota("claude", "ok", cli.stdout.trim());

  // 4. Dependencias del plugin (plugins oficiales).
  const lista = correr("claude", ["plugin", "list", "--json"]);
  let instalados = [];
  try { instalados = JSON.parse(lista.stdout); } catch { instalados = null; }
  if (!Array.isArray(instalados)) anota("plugins", "aviso", `no pude leer \`claude plugin list --json\`: ${lista.salida.slice(0, 200)}`);
  else {
    for (const dep of DEPENDENCIAS) {
      const p = instalados.find((x) => x.id === dep);
      if (p?.enabled) { anota(dep, "ok", `versión ${p.version}`); continue; }
      if (!instalar) { anota(dep, "aviso", p ? "instalado pero apagado" : "falta"); continue; }
      const r = p ? correr("claude", ["plugin", "enable", dep]) : correr("claude", ["plugin", "install", dep]);
      anota(dep, r.ok ? "instalado" : "aviso", r.ok ? (p ? "lo encendí" : "lo instalé (aplica al reiniciar Claude Code)") : `no pude ${p ? "encenderlo" : "instalarlo"}: ${r.salida.slice(0, 200)}`);
    }
  }

  // 5. MCPs de usuario.
  const mcp = correr("claude", ["mcp", "list"], { timeout: 180_000 });
  const nombres = new Set(mcp.stdout.split(/\r?\n/).map((l) => /^([^:\s]+):\s/.exec(l)?.[1]).filter(Boolean));
  for (const [nombre, cfg] of Object.entries(MCP_USUARIO)) {
    if (nombres.has(nombre)) { anota(`mcp:${nombre}`, "ok", cfg.para); continue; }
    if (cfg.instalar && instalar) {
      const r = correr("claude", cfg.instalar);
      anota(`mcp:${nombre}`, r.ok ? "instalado" : "aviso", r.ok ? `lo agregué a nivel usuario (${cfg.para}); aplica al reiniciar` : `no pude agregarlo: ${r.salida.slice(0, 200)}`);
    } else anota(`mcp:${nombre}`, cfg.humano ? "humano" : "aviso", cfg.humano ?? "falta");
  }

  // 6. Software del sistema: no se instala solo; se dice qué falta.
  const sistema = [
    ["git", ["--version"], "control de versiones (todas las fases)"],
    ["gh", ["--version"], "repos y PRs (fases 14 y 17)"],
  ];
  for (const [cmd, a, para] of sistema) {
    const r = correr(cmd, a);
    anota(cmd, r.ok ? "ok" : "humano", r.ok ? para : `falta \`${cmd}\` (${para})`);
  }
  const py = ["py", "python3", "python"].map((c) => [c, correr(c, ["--version"])]).find(([, r]) => r.ok && /Python 3\.\d+/.test(r.salida));
  anota("python", py ? "ok" : "humano", py ? `${py[1].salida} (ui-ux-pro-max y logo-design)` : "falta Python 3 real (ui-ux-pro-max y logo-design lo usan). Windows: winget install --id Python.Python.3.13 -e · macOS: brew install python@3.13");
  const firma = correr("ssh-keygen", ["-Y", "check-novalidate", "-n", "x", "-s", join(plugin, "no-existe.sig")]);
  const tieneY = !/illegal option|unknown option|invalid option/i.test(firma.salida) && !firma.falta;
  anota("ssh-keygen", tieneY ? "ok" : "humano", tieneY ? "verifica la firma de la marca de agua" : "falta ssh-keygen con -Y (OpenSSH 8.1+): el verificador de la marca no puede revisar exenciones");

  // 7. La copia de la marca de agua dentro del proyecto, si ya existe.
  const marca = join(proyecto, ".idealas", "marca");
  if (existsSync(marca)) {
    const canon = [
      ["verificar.mjs", join(plugin, "skills", "crear", "scripts", "marca", "verificar.mjs")],
      ["allowed_signers", join(plugin, "skills", "crear", "scripts", "marca", "allowed_signers")],
    ];
    const cambiados = canon.filter(([n, c]) => !existsSync(join(marca, n)) || sha256(join(marca, n)) !== sha256(c)).map(([n]) => n);
    anota("marca-de-agua", cambiados.length ? "aviso" : "ok",
      cambiados.length
        ? `.idealas/marca/ no es la del plugin (${cambiados.join(", ")}). Si el plugin se actualizó, vuelve a copiarla; si alguien la editó, repórtalo a Nathan o Daniel y no la «arregles» en silencio`
        : "la copia del proyecto es la del plugin");
  }

  // 8. ¿Hay versión nueva del plugin? Repo privado: usa las credenciales de gh.
  let local = null;
  try { local = JSON.parse(readFileSync(join(plugin, ".claude-plugin", "plugin.json"), "utf8")).version; } catch { /* sin manifiesto: abajo se reporta */ }
  const remoto = correr("gh", ["api", `repos/${REPO_PLUGIN}/contents/.claude-plugin/plugin.json`, "--jq", ".content"]);
  if (!local || !remoto.ok) anota("actualizacion", "aviso", "no pude comparar con la versión publicada (¿gh sin sesión?)");
  else {
    let publicada = null;
    try { publicada = JSON.parse(Buffer.from(remoto.stdout.replace(/\s/g, ""), "base64").toString("utf8")).version; } catch { /* abajo */ }
    if (!publicada) anota("actualizacion", "aviso", "no pude leer la versión publicada");
    else if (!esMasNueva(publicada, local)) anota("actualizacion", "ok", `versión ${local}, la más nueva`);
    else if (!instalar) anota("actualizacion", "aviso", `hay versión ${publicada} (tienes ${local})`);
    else {
      const m = correr("claude", ["plugin", "marketplace", "update", "idealas"]);
      const u = m.ok ? correr("claude", ["plugin", "update", "idealas@idealas"]) : m;
      anota("actualizacion", u.ok ? "instalado" : "aviso", u.ok ? `actualicé de ${local} a ${publicada}: reinicia Claude Code para usarla` : `hay versión ${publicada} pero no pude actualizar: ${u.salida.slice(0, 200)}`);
    }
  }
  return res;
}

const SIMBOLO = { ok: "ok", instalado: "instalado", aviso: "aviso", humano: "te toca", bloquea: "BLOQUEA" };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf("--proyecto");
  const res = revisar({ instalar: !argv.includes("--sin-instalar"), proyecto: i >= 0 ? resolve(argv[i + 1]) : process.cwd() });
  if (argv.includes("--json")) console.log(JSON.stringify(res, null, 2));
  else for (const r of res) console.log(`${SIMBOLO[r.estado].padEnd(9)} ${r.id}: ${r.detalle}`);
  process.exit(res.some((r) => r.estado === "bloquea") ? 1 : 0);
}
