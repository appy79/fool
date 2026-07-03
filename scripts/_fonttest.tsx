import path from "node:path";
import { createRequire } from "node:module";
import React from "react";
import { Document, Font, Page, renderToFile, Text } from "@react-pdf/renderer";

const e = React.createElement;
const req = createRequire(import.meta.url);
const ff = (pkg: string, file: string) =>
  path.join(path.dirname(req.resolve(`${pkg}/package.json`)), "files", file);
const w = ff("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff");

async function test(name: string, ch: string) {
  try {
    Font.register({ family: name, src: w });
    const doc = e(
      Document,
      null,
      e(Page, { size: "LETTER", style: { padding: 30 } }, e(Text, { style: { fontFamily: name, fontSize: 10 } }, "A" + ch + "B")),
    );
    await renderToFile(doc, `/tmp/_ftc_${name}.pdf`);
    console.log(`OK   '${ch}' (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")})`);
  } catch (err) {
    console.log(`FAIL '${ch}' (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}): ${(err as Error).message}`);
  }
}

async function main() {
  const chars = [" ", ".", ",", ":", "-", "+", "/", "@", "&", "·"];
  for (let i = 0; i < chars.length; i++) await test(`c${i}`, chars[i]);
}
main();
