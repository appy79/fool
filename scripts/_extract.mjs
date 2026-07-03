// Font-aware PDF text extractor for verifying ATS-readability of the generated résumé.
// Tracks the active font (Tf) and decodes each text run with THAT font's ToUnicode CMap, so
// multi-font documents (Inter + Space Grotesk + IBM Plex Mono) extract correctly.
import fs from "node:fs";
import zlib from "node:zlib";

const file = process.argv[2];
const buf = fs.readFileSync(file);
const raw = buf.toString("latin1"); // 1 byte/char → string index === byte offset

// --- Parse indirect objects: objnum -> { body, stream(inflated latin1) } -------------------
const objects = new Map();
for (const m of raw.matchAll(/(\d+)\s+\d+\s+obj([\s\S]*?)endobj/g)) {
  const num = Number(m[1]);
  const body = m[2];
  let stream = null;
  const sIdx = body.indexOf("stream");
  if (sIdx !== -1) {
    const absStart = m.index + m[1].length + " 0 obj".length; // approx; recompute precisely below
    // find precise stream byte range within the whole buffer
    const streamKeyword = raw.indexOf("stream", m.index);
    let st = streamKeyword + 6;
    if (raw[st] === "\r") st++;
    if (raw[st] === "\n") st++;
    const en = raw.indexOf("endstream", st);
    if (en !== -1) {
      try {
        stream = zlib.inflateSync(buf.subarray(st, en)).toString("latin1");
      } catch {
        stream = null;
      }
    }
    void absStart;
  }
  objects.set(num, { body, stream });
}

// --- Parse a ToUnicode CMap stream into code(int) -> string --------------------------------
function parseCMap(data) {
  const map = new Map();
  const hex2str = (hex) => {
    const h = hex.replace(/\s+/g, "");
    let s = "";
    for (let i = 0; i + 3 < h.length; i += 4) s += String.fromCharCode(parseInt(h.slice(i, i + 4), 16));
    return s;
  };
  for (const block of data.match(/beginbfchar([\s\S]*?)endbfchar/g) || []) {
    for (const m of block.matchAll(/<([0-9A-Fa-f\s]+)>\s*<([0-9A-Fa-f\s]+)>/g)) {
      map.set(parseInt(m[1].replace(/\s+/g, ""), 16), hex2str(m[2]));
    }
  }
  for (const block of data.match(/beginbfrange([\s\S]*?)endbfrange/g) || []) {
    for (const m of block.matchAll(/<([0-9A-Fa-f\s]+)>\s*<([0-9A-Fa-f\s]+)>\s*<([0-9A-Fa-f\s]+)>/g)) {
      const lo = parseInt(m[1].replace(/\s+/g, ""), 16);
      const hi = parseInt(m[2].replace(/\s+/g, ""), 16);
      const dst = parseInt(m[3].replace(/\s+/g, ""), 16);
      for (let c = lo; c <= hi; c++) map.set(c, String.fromCharCode(dst + (c - lo)));
    }
  }
  return map;
}

// --- Build fontObjNum -> CMap (a font dict has /ToUnicode N 0 R) ----------------------------
const cmapByFontObj = new Map();
for (const [num, obj] of objects) {
  const m = obj.body.match(/\/ToUnicode\s+(\d+)\s+\d+\s+R/);
  if (m) {
    const tu = objects.get(Number(m[1]));
    if (tu && tu.stream) cmapByFontObj.set(num, parseCMap(tu.stream));
  }
}

// --- Build resource name (/F1) -> CMap, via every /Font << ... >> dict ----------------------
const cmapByName = new Map();
for (const [, obj] of objects) {
  const fm = obj.body.match(/\/Font\s*<<([\s\S]*?)>>/);
  if (!fm) continue;
  for (const r of fm[1].matchAll(/\/(F\d+)\s+(\d+)\s+\d+\s+R/g)) {
    const cmap = cmapByFontObj.get(Number(r[2]));
    if (cmap) cmapByName.set(r[1], cmap);
  }
}

// --- Walk content streams, tracking the active font ----------------------------------------
function decodeHexRun(hex, cmap) {
  const h = hex.replace(/\s+/g, "");
  let out = "";
  for (let i = 0; i + 3 < h.length; i += 4) {
    const code = parseInt(h.slice(i, i + 4), 16);
    out += cmap ? (cmap.get(code) ?? "\uFFFD") : "\uFFFD";
  }
  return out;
}

let text = "";
for (const [, obj] of objects) {
  const d = obj.stream;
  if (!d || !/\bTf\b/.test(d) || !/\b(TJ|Tj)\b/.test(d)) continue;
  let cur = null;
  const re = /\/(F\d+)\s+[\d.]+\s+Tf|\[([^\]]*)\]\s*TJ|<([0-9A-Fa-f\s]+)>\s*Tj|(Td|TD|T\*)/g;
  let m;
  while ((m = re.exec(d)) !== null) {
    if (m[1]) {
      cur = cmapByName.get(m[1]) ?? null;
    } else if (m[2] !== undefined) {
      for (const h of m[2].match(/<[0-9A-Fa-f\s]+>/g) || []) text += decodeHexRun(h.slice(1, -1), cur);
      if (!text.endsWith(" ")) text += " ";
    } else if (m[3] !== undefined) {
      text += decodeHexRun(m[3], cur);
      if (!text.endsWith(" ")) text += " ";
    } else if (m[4]) {
      if (!text.endsWith("\n")) text += "\n";
    }
  }
  text += "\n";
}

console.log(text.replace(/[ \t]+/g, " ").replace(/ *\n+ */g, "\n").replace(/\n{2,}/g, "\n").trim());
