// One-off: replace em dash (—, U+2014) with a hyphen "-" in user-facing strings
// across src, while leaving code comments untouched. Walks .ts/.tsx files and
// uses a tiny lexer to tell strings/JSX-text (replace) from // and /* */ (keep).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");
const EM = "—";

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

// Returns transformed text + count. State machine over chars; replace EM only
// when NOT inside a // line comment or /* */ block comment.
function transform(src) {
  let out = "";
  let i = 0;
  let count = 0;
  let state = "normal"; // normal | line | block | "'" | '"' | "`"
  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];
    if (state === "normal") {
      if (ch === "/" && next === "/") { state = "line"; out += "//"; i += 2; continue; }
      if (ch === "/" && next === "*") { state = "block"; out += "/*"; i += 2; continue; }
      if (ch === "'" || ch === '"' || ch === "`") { state = ch; out += ch; i++; continue; }
      if (ch === EM) { out += "-"; count++; i++; continue; }
      out += ch; i++; continue;
    }
    if (state === "line") {
      out += ch; i++;
      if (ch === "\n") state = "normal";
      continue;
    }
    if (state === "block") {
      if (ch === "*" && next === "/") { state = "normal"; out += "*/"; i += 2; continue; }
      out += ch; i++; continue;
    }
    // inside a string / template literal
    if (ch === "\\") { out += ch + (next ?? ""); i += 2; continue; } // keep escapes
    if (ch === state) { state = "normal"; out += ch; i++; continue; }
    if (ch === EM) { out += "-"; count++; i++; continue; }
    out += ch; i++; continue;
  }
  return { out, count };
}

let total = 0;
const touched = [];
for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  if (!src.includes(EM)) continue;
  const { out, count } = transform(src);
  if (count > 0 && out !== src) {
    writeFileSync(file, out, "utf8");
    total += count;
    touched.push(`${path.relative(".", file)} (${count})`);
  }
}
console.log(`Replaced ${total} em dash(es) in ${touched.length} file(s):`);
for (const t of touched) console.log("  " + t);
