// El instalador con una máquina falsa: el camino feliz, la actualización, cada
// alto con su ayuda, --revisar sin tocar nada, la llave de 21st que nunca se
// imprime, y el arte que cabe en 80 columnas.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  instalar, crearPantalla, encabezado, pintarPixeles, a256, nivelColor, lineaCmd,
  TEMAS, SIMBOLO, NOMBRE, PLUGIN, REPO,
} from "../instalador/instalar.mjs";

const ok = (stdout = "") => ({ ok: true, stdout, salida: stdout, falta: false });
const falla = (salida = "error") => ({ ok: false, stdout: "", salida, falta: false });
const ausente = () => ({ ok: false, stdout: "", salida: "", falta: true });

function maquina({ gh = true, sesion = true, acceso = true, claude = true, marketplace = false, plugin = null, despues = "0.1.2", preflight = [{ id: "node", estado: "ok" }] } = {}) {
  const corridas = [];
  let instalado = plugin;
  const correr = async (cmd, args) => {
    const linea = [cmd, ...args].join(" ");
    corridas.push(linea);
    if (cmd === "git") return ok("git version 2.50.0");
    if (cmd === "gh" && args[0] === "--version") return gh ? ok("gh version 2.80.0") : ausente();
    if (linea === "gh auth status") return sesion ? ok("Logged in to github.com account nkisel24 (keyring)") : falla("not logged in");
    if (linea.startsWith("gh repo view")) return acceso ? ok("{}") : falla("Could not resolve to a Repository");
    if (linea === "gh auth setup-git") return ok();
    if (cmd === "claude" && args[0] === "--version") return claude ? ok("2.1.229 (Claude Code)") : ausente();
    if (linea === "claude plugin marketplace list --json") return ok(JSON.stringify(marketplace ? [{ name: "idealas" }] : []));
    if (linea === `claude plugin marketplace add ${REPO}` || linea === "claude plugin marketplace update idealas") return ok();
    if (linea === "claude plugin list --json") return ok(JSON.stringify(instalado ? [{ id: PLUGIN, version: instalado, installPath: "/p" }] : []));
    if (linea === `claude plugin install ${PLUGIN}` || linea === `claude plugin update ${PLUGIN}`) { instalado = despues; return ok(); }
    if (args.some((a) => a.endsWith("preflight.mjs"))) return ok(JSON.stringify(preflight));
    if (linea.startsWith("claude mcp add")) return ok();
    return ok();
  };
  return { correr, corridas };
}

function pantallaFalsa() {
  let texto = "";
  return { pantalla: crearPantalla({ escribir: (s) => { texto += s; } }), texto: () => texto };
}

const sin = async () => "";

test("máquina nueva: agrega el marketplace, instala y corre la revisión", async () => {
  const m = maquina();
  const p = pantallaFalsa();
  assert.equal(await instalar({ correr: m.correr, preguntar: sin, pantalla: p.pantalla }), 0);
  assert.ok(m.corridas.includes(`claude plugin marketplace add ${REPO}`));
  assert.ok(m.corridas.includes(`claude plugin install ${PLUGIN}`));
  assert.ok(m.corridas.includes("gh auth setup-git"));
  assert.ok(m.corridas.some((c) => c.includes("preflight.mjs --json")));
  assert.match(p.texto(), /instalado \(0\.1\.2\)/);
  assert.match(p.texto(), /\/idealas:crear tu idea en una frase/);
});

test("ya instalado: actualiza en vez de reinstalar", async () => {
  const m = maquina({ marketplace: true, plugin: "0.1.1" });
  const p = pantallaFalsa();
  await instalar({ correr: m.correr, preguntar: sin, pantalla: p.pantalla });
  assert.ok(m.corridas.includes("claude plugin marketplace update idealas"));
  assert.ok(m.corridas.includes(`claude plugin update ${PLUGIN}`));
  assert.ok(!m.corridas.includes(`claude plugin install ${PLUGIN}`));
  assert.match(p.texto(), /actualizado 0\.1\.1 → 0\.1\.2/);
});

test("cada alto se detiene con su ayuda y sin instalar nada después", async () => {
  const casos = [
    [{ gh: false }, /Falta la CLI de GitHub/, /winget install --id GitHub\.cli/],
    [{ sesion: false }, /No hay sesión de GitHub/, /gh auth login/],
    [{ acceso: false }, /no ve nkisel24\/idealas-crear/, /Pídele a Nathan/],
    [{ claude: false }, /No encuentro Claude Code/, /code\.claude\.com/],
  ];
  for (const [cfg, que, ayuda] of casos) {
    const m = maquina(cfg);
    const p = pantallaFalsa();
    // Sin sesión: el usuario dice «n» a iniciarla ahora.
    assert.equal(await instalar({ correr: m.correr, preguntar: async () => "n", pantalla: p.pantalla }), 1, JSON.stringify(cfg));
    assert.match(p.texto(), que);
    assert.match(p.texto(), ayuda);
    assert.ok(!m.corridas.some((c) => / install | marketplace add /.test(` ${c} `)), `instaló algo con ${JSON.stringify(cfg)}`);
  }
});

test("sin sesión de GitHub y el usuario acepta: abre gh auth login interactivo", async () => {
  const m = maquina({ sesion: false });
  const interactivos = [];
  const correr = async (cmd, args, op = {}) => { if (op.interactivo) interactivos.push([cmd, ...args].join(" ")); return m.correr(cmd, args); };
  await instalar({ correr, preguntar: async () => "s", pantalla: pantallaFalsa().pantalla });
  assert.deepEqual(interactivos, ["gh auth login"]);
});

test("--revisar no instala, no actualiza y no configura nada", async () => {
  const m = maquina({ marketplace: true, plugin: "0.1.1" });
  await instalar({ correr: m.correr, preguntar: sin, pantalla: pantallaFalsa().pantalla, opciones: { revisar: true } });
  assert.deepEqual(m.corridas.filter((c) => / install | update | add | setup-git /.test(` ${c} `)), []);
  assert.ok(m.corridas.some((c) => c.includes("preflight.mjs --json --sin-instalar")));
});

test("la llave de 21st va a claude mcp add y nunca se imprime", async () => {
  const llave = "k21st_ABCDEFGH12345678";
  const m = maquina({ preflight: [{ id: "mcp:21st", estado: "humano", detalle: "21st necesita tu llave" }] });
  const p = pantallaFalsa();
  const preguntas = [];
  await instalar({ correr: m.correr, preguntar: async (t, o) => { preguntas.push(o); return llave; }, pantalla: p.pantalla });
  assert.deepEqual(preguntas, [{ oculto: true }], "la pregunta de la llave tiene que ser sin eco");
  assert.ok(m.corridas.some((c) => c.startsWith("claude mcp add --scope user --transport http 21st https://21st.dev/api/mcp --header") && c.endsWith(`x-api-key: ${llave}`)));
  assert.ok(!p.texto().includes(llave), "la llave apareció en pantalla");
  assert.doesNotMatch(p.texto(), /Te toca · 21st/);
});

test("una «llave» que no lo parece no se manda", async () => {
  const m = maquina({ preflight: [{ id: "mcp:21st", estado: "humano", detalle: "x" }] });
  await instalar({ correr: m.correr, preguntar: async () => "hola & del *", pantalla: pantallaFalsa().pantalla });
  assert.ok(!m.corridas.some((c) => c.startsWith("claude mcp add")));
});

test("desinstalar pregunta antes y quita plugin y marketplace", async () => {
  const m = maquina();
  assert.equal(await instalar({ correr: m.correr, preguntar: async () => "", pantalla: pantallaFalsa().pantalla, opciones: { desinstalar: true } }), 0);
  assert.deepEqual(m.corridas, [], "con la respuesta por default (no) no debe tocar nada");
  await instalar({ correr: m.correr, preguntar: async () => "s", pantalla: pantallaFalsa().pantalla, opciones: { desinstalar: true } });
  assert.deepEqual(m.corridas, [`claude plugin uninstall ${PLUGIN}`, "claude plugin marketplace remove idealas"]);
});

test("el arte: cuadrículas parejas y el encabezado cabe en 80 columnas", () => {
  for (const g of [SIMBOLO, NOMBRE]) {
    assert.equal(g.length % 2, 0);
    assert.ok(g.every((f) => f.length === g[0].length && /^[.KBT]+$/.test(f)));
  }
  for (const nivel of ["true", "256"]) {
    const lineas = encabezado(TEMAS.oscuro, nivel);
    const visibles = lineas.map((l) => l.replace(/\x1b\[[0-9;]*m/g, ""));
    assert.ok(Math.max(...visibles.map((l) => [...l].length)) <= 80, "más ancho que 80 columnas");
  }
  assert.deepEqual(pintarPixeles(["K.", "KB"], TEMAS.oscuro, "no"), ["█▄"]);
});

test("sin color: ni un código de escape", () => {
  const todo = encabezado(TEMAS.oscuro, "no").join("\n");
  assert.doesNotMatch(todo, /\x1b/);
  assert.equal(nivelColor({ NO_COLOR: "" }, true), "no");
  assert.equal(nivelColor({}, false), "no");
  assert.equal(nivelColor({ COLORTERM: "truecolor" }, true), "true");
});

test("a256 cae en el cubo o en la rampa de grises", () => {
  assert.equal(a256([0, 0, 0]), 16);
  assert.equal(a256([255, 255, 255]), 231);
  const azul = a256([142, 151, 240]);
  assert.ok(azul >= 16 && azul <= 231);
});

test("lineaCmd entrecomilla lo que tiene espacios", () => {
  assert.equal(lineaCmd("claude", ["mcp", "add", "--header", "x-api-key: abc"]), 'claude mcp add --header "x-api-key: abc"');
});
