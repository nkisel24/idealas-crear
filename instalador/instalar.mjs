#!/usr/bin/env node
// El instalador del motor de creación de Idealas (/idealas:crear).
//
// Un solo archivo, sin dependencias, para que se pueda descargar suelto
// (`gh release download`) y correr con `node instalar.mjs` o con doble clic
// desde los lanzadores de esta carpeta. Hace en orden lo que dice el README
// del repo: revisa Node, git, gh (y su sesión), el acceso al repo privado y
// Claude Code; agrega el marketplace `idealas`, instala o actualiza el plugin,
// corre su revisión de arranque y, si quieres, deja puesta tu llave de 21st.
//
// No baja ni ejecuta nada de internet por su cuenta: todo pasa por `gh` y
// `claude`, que ya validan lo que instalan. La llave de 21st se escribe sin
// eco, va directo a `claude mcp add` y nunca se imprime.
//
// Uso: node instalar.mjs [--revisar] [--desinstalar] [--si] [--tema claro|oscuro]
//                        [--sin-color] [--sin-animacion]

import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = "nkisel24/idealas-crear";
export const MARKETPLACE = "idealas";
export const PLUGIN = "idealas@idealas";
const NODE_MINIMO = 24;

// ---- La marca, en píxeles ----------------------------------------------------
// Rasterizados del wordmark del Idealas Design System (símbolo de tres plumas
// a 26 px; «Idealas» en Schibsted Grotesk 600 a 12 px). K = pluma de tinta,
// B = pluma y punto azules, T = texto. Dos filas de píxeles = un renglón.

export const SIMBOLO = [
  "..............K........", "........K....KK.......B", "........K....KK.....BBB", ".......KK...KKK....BBBB",
  ".......KK..KKKK...BBBB.", ".......KK..KKK...BBBBB.", "......KKK.KKKK..BBBBBB.", "......KKKKKKKK.BBBBBB..",
  "......KKKKKKKKBBBBBBB..", ".....KKKKKKKKBBBBBBB...", ".....KKKKKKKBBBBBBBB...", ".....KKKKKKBBBBBBBB....",
  ".....KKKKKBBBBBBBB.....", ".....KKKKBBBBBBBBB.....", "....KKKKBBBBBBBBB......", "....KKKBBBBBBBBB.......",
  "....KKKBBBBBBB.........", "....KKBBBBBBB..........", "....KBBBBBB............", "....BBBB...............",
  ".......................", ".......................", "BBBB...................", "BBBB...................",
  "BBBB...................", ".BB....................",
];
export const NOMBRE = [
  "TTTT.......TT..................T.................", "TTTTT......TT..................T.................",
  ".TT........TT..................T.................", ".TT...TTTTTTT..TTTTT...TTTTT...T...TTTTT...TTTTT.",
  ".TT...TT..TTT.TTT..TT.TTT..TT..T..TT...T..TT..TT.", ".TT..TT....TT.TT...TT......TT..T.......TT.TTT....",
  ".TT..TT....TT.TTTTTTT..TTTTTT..T...TTTTTT..TTTTT.", ".TT..TT....TT.TT......TT...TT..T..TT...TT.....TT.",
  ".TT...TT..TTT.TT...TT.TT...TT..T..TT...TT.TT...TT", "TTTTT.TTTTTTT..TTTTT..TTTTTTT..TT.TTTTTTT.TTTTTT.",
  "TTTT...TTT.T....TTT....TTT..T...T..TTT..T...TTT..", ".................................................",
];

// Los colores de la marca: sobre terminal oscura, el par «sobre tinta» del
// design system (porcelana + azul 400); sobre clara, tinta + azul 600.
export const TEMAS = {
  oscuro: { K: [242, 241, 244], T: [242, 241, 244], B: [142, 151, 240], tenue: [154, 152, 163] },
  claro: { K: [23, 22, 28], T: [23, 22, 28], B: [44, 54, 166], tenue: [107, 104, 115] },
};

/** Índice xterm-256 más cercano (cubo 6×6×6 o rampa de grises). */
export function a256([r, g, b]) {
  const gris = Math.round((r + g + b) / 3);
  if (Math.max(r, g, b) - Math.min(r, g, b) < 12) {
    if (gris < 8) return 16;
    if (gris > 248) return 231;
    return 232 + Math.round((gris - 8) / 247 * 24);
  }
  const c = (v) => (v < 48 ? 0 : v < 115 ? 1 : Math.round((v - 35) / 40));
  return 16 + 36 * c(r) + 6 * c(g) + c(b);
}

/** Pinta qué tan bien: 'true' (24 bits), '256' o 'no'. */
export function nivelColor(env = process.env, tty = process.stdout.isTTY) {
  if (!tty || "NO_COLOR" in env || env.TERM === "dumb") return "no";
  if (/truecolor|24bit/i.test(env.COLORTERM ?? "") || env.WT_SESSION || ["vscode", "iTerm.app", "WezTerm"].includes(env.TERM_PROGRAM)) return "true";
  return "256";
}

function sgr(nivel, rgb, fondo = false) {
  if (nivel === "no" || !rgb) return "";
  if (nivel === "true") return `\x1b[${fondo ? 48 : 38};2;${rgb.join(";")}m`;
  return `\x1b[${fondo ? 48 : 38};5;${a256(rgb)}m`;
}
const RESET = "\x1b[0m";

/** Una cuadrícula de píxeles a renglones de medios bloques. */
export function pintarPixeles(filas, tema, nivel) {
  const out = [];
  for (let y = 0; y < filas.length; y += 2) {
    let linea = "";
    for (let x = 0; x < filas[y].length; x++) {
      const a = tema[filas[y][x]];
      const b = tema[(filas[y + 1] ?? "")[x]];
      if (!a && !b) linea += " ";
      else if (a && !b) linea += `${sgr(nivel, a)}▀${nivel === "no" ? "" : RESET}`;
      else if (!a && b) linea += `${sgr(nivel, b)}▄${nivel === "no" ? "" : RESET}`;
      else if (a.join() === b.join()) linea += `${sgr(nivel, a)}█${nivel === "no" ? "" : RESET}`;
      else linea += `${sgr(nivel, a)}${sgr(nivel, b, true)}▀${RESET}`;
    }
    out.push(linea);
  }
  return out;
}

/** El encabezado: símbolo a la izquierda, nombre y lema a la derecha. */
export function encabezado(tema, nivel) {
  if (nivel === "no") return ["Idealas · Motor de creación (/idealas:crear)", "Ideas que vuelan.", ""];
  const sim = pintarPixeles(SIMBOLO, tema, nivel);
  const nom = pintarPixeles(NOMBRE, tema, nivel);
  const desde = 4; // el nombre se sienta a media altura del símbolo, como en la barra del sitio
  const t = (s) => `${sgr(nivel, tema.tenue)}${s}${RESET}`;
  const lineas = sim.map((l, i) => {
    const j = i - desde;
    const derecha = j >= 0 && j < nom.length ? nom[j] : j === nom.length + 0 ? t("Motor de creación · /idealas:crear") : j === nom.length + 1 ? t("Ideas que vuelan.") : "";
    return `  ${l}    ${derecha}`;
  });
  return ["", ...lineas, ""];
}

// ---- Ejecutar ------------------------------------------------------------------

/**
 * Una línea de cmd.exe con cada argumento entre comillas. Sólo para el
 * respaldo de Windows de abajo; los argumentos son nuestros (y la llave de
 * 21st ya pasó por su validación), nunca texto libre.
 */
export function lineaCmd(cmd, args) {
  return [cmd, ...args].map((a) => (/^[\w@./:=-]+$/.test(a) ? a : `"${a.replace(/"/g, '\\"')}"`)).join(" ");
}

/** Ejecutor real, asíncrono (para que la animación corra mientras espera). */
export function correrReal(cmd, args, { interactivo = false, timeout = 600_000, conShell = false } = {}) {
  return new Promise((listo) => {
    let stdout = "";
    let stderr = "";
    let hijo;
    try {
      const stdio = interactivo ? "inherit" : ["ignore", "pipe", "pipe"];
      hijo = conShell
        ? spawn(lineaCmd(cmd, args), { stdio, shell: true, windowsHide: !interactivo })
        : spawn(cmd, args, { stdio, windowsHide: !interactivo });
    } catch (e) {
      listo({ ok: false, stdout: "", salida: String(e.message), falta: true });
      return;
    }
    const reloj = interactivo ? null : setTimeout(() => hijo.kill(), timeout);
    hijo.stdout?.on("data", (d) => { stdout += d; });
    hijo.stderr?.on("data", (d) => { stderr += d; });
    hijo.on("error", (e) => {
      if (reloj) clearTimeout(reloj);
      // En Windows, Claude Code instalado con npm es `claude.cmd`, que no se
      // lanza sin shell: se reintenta una vez por cmd.exe.
      if (e.code === "ENOENT" && process.platform === "win32" && !conShell && cmd === "claude") {
        correrReal(cmd, args, { interactivo, timeout, conShell: true }).then(listo);
        return;
      }
      listo({ ok: false, stdout, salida: e.message, falta: e.code === "ENOENT" });
    });
    hijo.on("close", (code) => { if (reloj) clearTimeout(reloj); listo({ ok: code === 0, stdout, salida: `${stdout}${stderr}`.trim(), falta: false }); });
  });
}

// ---- La salida, con un renglón por paso ---------------------------------------

export function crearPantalla({ escribir = (s) => process.stdout.write(s), nivel = "no", tema = TEMAS.oscuro, animar = false } = {}) {
  const ANCHO = 34;
  const c = (rgb, s) => (nivel === "no" ? s : `${sgr(nivel, rgb)}${s}${RESET}`);
  let girando = null;
  return {
    texto: (s = "") => escribir(`${s}\n`),
    titulo: (s) => escribir(`\n  ${nivel === "no" ? s : `\x1b[1m${s}${RESET}`}\n\n`),
    async paso(nombre, trabajo) {
      const etiqueta = `${nombre} `.padEnd(ANCHO, "·");
      // El latido del punto azul (el estado «latido» del símbolo) mientras espera.
      const cuadros = ["·", "•", "●", "•"];
      let i = 0;
      if (animar) {
        escribir(`  ${c(tema.B, "●")} ${etiqueta} `);
        girando = setInterval(() => { escribir(`\r  ${c(tema.B, cuadros[i++ % 4])} ${etiqueta} `); }, 160);
      }
      let r;
      try { r = await trabajo(); } finally { if (girando) { clearInterval(girando); girando = null; } }
      const marca = r.estado === "ok" ? c(tema.B, "✓") : r.estado === "aviso" ? c(tema.tenue, "○") : c([230, 120, 110], "✗");
      escribir(`${animar ? "\r" : ""}  ${marca} ${etiqueta} ${r.detalle}\n`);
      return r;
    },
  };
}

// ---- El flujo ----------------------------------------------------------------------

const ok = (detalle) => ({ estado: "ok", detalle });
const aviso = (detalle) => ({ estado: "aviso", detalle });
const alto = (detalle, ayuda) => ({ estado: "alto", detalle, ayuda });

function versionDe(salida) { return /(\d+\.\d+\.\d+)/.exec(salida)?.[1] ?? salida.trim(); }

/**
 * Instala (o revisa, o desinstala) el motor. Todo lo que toca la máquina pasa
 * por `correr` y todo lo que pregunta por `preguntar`, para poder probarlo.
 * Devuelve 0 si terminó bien y 1 si se detuvo.
 */
export async function instalar({ correr = correrReal, preguntar, pantalla, opciones = {} } = {}) {
  const { revisar = false, desinstalar = false, si = false } = opciones;
  const P = pantalla;
  const detener = (r) => { P.texto(); P.texto(`  ${r.detalle}`); if (r.ayuda) P.texto(`  ${r.ayuda}`); P.texto(); return 1; };

  if (desinstalar) {
    P.titulo("Desinstalar el motor de Idealas");
    const s = si || (await preguntar("¿Quito el plugin idealas y su marketplace de esta máquina? [s/N] ")).trim().toLowerCase().startsWith("s");
    if (!s) { P.texto("  No toqué nada."); return 0; }
    await P.paso("Plugin idealas", async () => { const r = await correr("claude", ["plugin", "uninstall", PLUGIN]); return r.ok ? ok("quitado") : aviso(r.salida.split("\n")[0] || "no estaba"); });
    await P.paso("Marketplace idealas", async () => { const r = await correr("claude", ["plugin", "marketplace", "remove", MARKETPLACE]); return r.ok ? ok("quitado") : aviso(r.salida.split("\n")[0] || "no estaba"); });
    P.texto("\n  Las dependencias (claude-security, playground) se quedan: otros plugins pueden usarlas.");
    P.texto("  Para quitarlas también: claude plugin prune\n");
    return 0;
  }

  P.titulo(revisar ? "Revisando esta máquina (sin instalar nada)" : "Instalando el motor de creación en esta máquina");

  const node = await P.paso("Node.js", async () => {
    const v = Number(process.versions.node.split(".")[0]);
    return v >= NODE_MINIMO ? ok(process.versions.node) : alto(`Node ${process.versions.node}: el motor pide ${NODE_MINIMO} o más.`, "Windows: winget install --id OpenJS.NodeJS.LTS -e · macOS: brew install node@24");
  });
  if (node.estado === "alto") return detener(node);

  const git = await P.paso("Git", async () => { const r = await correr("git", ["--version"]); return r.ok ? ok(versionDe(r.salida)) : alto("Falta Git.", "Windows: winget install --id Git.Git -e · macOS: xcode-select --install"); });
  if (git.estado === "alto") return detener(git);

  const gh = await P.paso("GitHub CLI (gh)", async () => { const r = await correr("gh", ["--version"]); return r.ok ? ok(versionDe(r.salida)) : alto("Falta la CLI de GitHub.", "Windows: winget install --id GitHub.cli -e · macOS: brew install gh"); });
  if (gh.estado === "alto") return detener(gh);

  let sesion = await correr("gh", ["auth", "status"]);
  if (!sesion.ok && !revisar) {
    P.texto("\n  Necesitas iniciar sesión en GitHub (el repo del motor es privado).");
    const s = si || !(await preguntar("  ¿La inicio ahora? Se abre el flujo de gh en esta misma ventana. [S/n] ")).trim().toLowerCase().startsWith("n");
    if (s) { await correr("gh", ["auth", "login"], { interactivo: true }); sesion = await correr("gh", ["auth", "status"]); }
  }
  const cuenta = /account (\S+)/.exec(sesion.salida)?.[1];
  const ses = await P.paso("Sesión de GitHub", async () => (sesion.ok ? ok(cuenta ? `como ${cuenta}` : "activa") : alto("No hay sesión de GitHub.", "Corre: gh auth login, y vuelve a abrir este instalador.")));
  if (ses.estado === "alto") return detener(ses);

  const acceso = await P.paso("Acceso al repo del motor", async () => {
    const r = await correr("gh", ["repo", "view", REPO, "--json", "name"]);
    return r.ok ? ok(REPO) : alto(`Tu cuenta no ve ${REPO}.`, "Pídele a Nathan que te dé acceso al repo y vuelve a correr el instalador.");
  });
  if (acceso.estado === "alto") return detener(acceso);

  if (!revisar) {
    await P.paso("Git con tu sesión de gh", async () => { const r = await correr("gh", ["auth", "setup-git"]); return r.ok ? ok("listo") : aviso("no pude configurarlo; si el marketplace falla, corre: gh auth setup-git"); });
  }

  const claude = await P.paso("Claude Code", async () => {
    const r = await correr("claude", ["--version"]);
    return r.ok ? ok(versionDe(r.salida)) : alto("No encuentro Claude Code (la CLI `claude`).", "Instálalo con la guía oficial: https://code.claude.com/docs/en/setup, y vuelve a abrir este instalador.");
  });
  if (claude.estado === "alto") return detener(claude);

  const mk = await P.paso("Marketplace de Idealas", async () => {
    const l = await correr("claude", ["plugin", "marketplace", "list", "--json"]);
    let lista = [];
    try { lista = JSON.parse(l.stdout); } catch { lista = []; }
    const ya = Array.isArray(lista) && lista.some((m) => m.name === MARKETPLACE);
    if (revisar) return ya ? ok("agregado") : aviso("falta");
    const r = ya ? await correr("claude", ["plugin", "marketplace", "update", MARKETPLACE]) : await correr("claude", ["plugin", "marketplace", "add", REPO]);
    return r.ok ? ok(ya ? "al día" : "agregado") : alto("No pude agregar el marketplace.", r.salida.split("\n").slice(-3).join(" "));
  });
  if (mk.estado === "alto") return detener(mk);

  let rutaPlugin = null;
  const plug = await P.paso("Plugin idealas", async () => {
    const leer = async () => {
      const l = await correr("claude", ["plugin", "list", "--json"]);
      try { return JSON.parse(l.stdout).find((p) => p.id === PLUGIN) ?? null; } catch { return null; }
    };
    let p = await leer();
    if (revisar) { rutaPlugin = p?.installPath ?? null; return p ? ok(`instalado (${p.version})`) : aviso("falta"); }
    const antes = p?.version;
    const r = p ? await correr("claude", ["plugin", "update", PLUGIN]) : await correr("claude", ["plugin", "install", PLUGIN]);
    if (!r.ok) return alto("No pude instalar el plugin.", r.salida.split("\n").slice(-3).join(" "));
    p = await leer();
    rutaPlugin = p?.installPath ?? null;
    if (!p) return alto("El plugin no aparece después de instalarlo.", "Corre: claude plugin list, y avísale a Nathan.");
    return ok(!antes ? `instalado (${p.version})` : antes === p.version ? `al día (${p.version})` : `actualizado ${antes} → ${p.version}`);
  });
  if (plug.estado === "alto") return detener(plug);

  let pendientes = [];
  if (rutaPlugin) {
    await P.paso("Revisión de arranque", async () => {
      const args = [resolve(rutaPlugin, "skills", "crear", "scripts", "preflight.mjs"), "--json"];
      if (revisar) args.push("--sin-instalar");
      const r = await correr(process.execPath, args);
      let res = [];
      try { res = JSON.parse(r.stdout); } catch { return aviso("no pude leer su resultado"); }
      const bloquea = res.filter((x) => x.estado === "bloquea");
      pendientes = res.filter((x) => x.estado === "humano");
      const bien = res.filter((x) => ["ok", "instalado"].includes(x.estado)).length;
      if (bloquea.length) return alto(`Bloquea: ${bloquea.map((x) => x.id).join(", ")}`, "Avísale a Nathan o Daniel antes de usar el motor.");
      return pendientes.length ? aviso(`${bien} en orden, ${pendientes.length} te ${pendientes.length === 1 ? "toca" : "tocan"}`) : ok(`${bien} en orden`);
    });
  }

  // La llave de 21st: opcional; sin eco y directo a `claude mcp add`.
  const falta21 = pendientes.find((x) => x.id === "mcp:21st");
  if (falta21 && !revisar && !si) {
    P.texto("\n  21st (componentes e inspiración) necesita tu llave personal del plan gratis.");
    P.texto("  Sácala de https://21st.dev/mcp con el botón de copiar.");
    const llave = (await preguntar("  Pégala aquí (no se ve al escribir), o Enter para saltar: ", { oculto: true })).trim();
    if (llave) {
      await P.paso("21st", async () => {
        if (!/^[\w.-]{16,200}$/.test(llave)) return aviso("eso no parece una llave de 21st; sáltalo y agrégala después");
        const r = await correr("claude", ["mcp", "add", "--scope", "user", "--transport", "http", "21st", "https://21st.dev/api/mcp", "--header", `x-api-key: ${llave}`]);
        return r.ok ? ok("agregado") : aviso("no pude agregarlo; corre el comando del README a mano");
      });
      pendientes = pendientes.filter((x) => x !== falta21);
    }
  }

  P.texto();
  for (const x of pendientes) P.texto(`  Te toca · ${x.detalle}`);
  if (pendientes.length) P.texto();
  if (revisar) { P.texto("  Revisión hecha. Para instalar lo que falta, corre el instalador sin --revisar."); P.texto(); return 0; }
  P.texto("  Listo. Reinicia Claude Code y escribe:");
  P.texto();
  P.texto("      /idealas:crear tu idea en una frase");
  P.texto();
  return 0;
}

// ---- Preguntar en la terminal ---------------------------------------------------

function preguntarReal(texto, { oculto = false } = {}) {
  return new Promise((listo) => {
    const entrada = process.stdin;
    process.stdout.write(texto);
    if (!entrada.isTTY) {
      let s = "";
      entrada.setEncoding("utf8");
      entrada.once("data", (d) => { s += d; listo(s.split(/\r?\n/)[0]); });
      entrada.once("end", () => listo(s));
      return;
    }
    let respuesta = "";
    entrada.setRawMode(true);
    entrada.resume();
    entrada.setEncoding("utf8");
    const alTeclear = (tecla) => {
      for (const ch of tecla) {
        if (ch === "\u0003") { entrada.setRawMode(false); process.stdout.write("\n"); process.exit(130); }
        if (ch === "\r" || ch === "\n") {
          entrada.setRawMode(false); entrada.pause(); entrada.off("data", alTeclear);
          process.stdout.write("\n"); listo(respuesta); return;
        }
        if (ch === "\u007f" || ch === "\b") { if (respuesta) { respuesta = respuesta.slice(0, -1); if (!oculto) process.stdout.write("\b \b"); } continue; }
        respuesta += ch;
        if (!oculto) process.stdout.write(ch);
      }
    };
    entrada.on("data", alTeclear);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf("--tema");
  const temaPedido = i >= 0 ? argv[i + 1] : /;(7|15)$/.test(process.env.COLORFGBG ?? "") ? "claro" : "oscuro";
  const tema = TEMAS[temaPedido] ?? TEMAS.oscuro;
  const nivel = argv.includes("--sin-color") ? "no" : nivelColor();
  const animar = process.stdout.isTTY && !argv.includes("--sin-animacion") && nivel !== "no";
  for (const l of encabezado(tema, nivel)) process.stdout.write(`${l}\n`);
  const pantalla = crearPantalla({ nivel, tema, animar });
  instalar({
    preguntar: preguntarReal,
    pantalla,
    opciones: { revisar: argv.includes("--revisar"), desinstalar: argv.includes("--desinstalar"), si: argv.includes("--si") },
  }).then((codigo) => process.exit(codigo), (e) => { process.stderr.write(`\n  El instalador falló: ${e.message}\n`); process.exit(1); });
}
