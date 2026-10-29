// Writes smaller copies of every screenshot in public/projects/ next to it,
// for srcset; src/imageCopies.js sets their widths and names. Run it with
// `npm run images` after adding or changing a screenshot, then commit the
// copies. Safe to rerun: copies are always made from the originals, never
// from another copy, and a copy that would come out the same is left alone.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { copyPath, copyWidths, isCopy } from "../src/imageCopies.js";

const ROOT = fileURLToPath(new URL("../public/projects/", import.meta.url));
const IMAGE = /\.(webp|png|jpe?g)$/i;
// The same WebP quality the originals are saved at.
const WEBP = { quality: 85, effort: 6 };

async function findOriginals(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await findOriginals(path)));
    else if (IMAGE.test(entry.name) && !isCopy(entry.name)) found.push(path);
  }
  return found.sort();
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

let originalBytes = 0;
let copyBytes = 0;
let written = 0;
let unchanged = 0;

const originals = await findOriginals(ROOT);

for (const file of originals) {
  const input = await readFile(file);
  const { width, height } = await sharp(input).metadata();
  originalBytes += input.length;

  for (const w of copyWidths({ width, height })) {
    const out = copyPath(file, w);
    const data = await sharp(input).resize({ width: w }).webp(WEBP).toBuffer();
    copyBytes += data.length;

    const current = await readFile(out).catch(() => null);
    if (current?.equals(data)) {
      unchanged++;
      continue;
    }

    await writeFile(out, data);
    written++;
    console.log(`wrote ${relative(ROOT, out)}  ${kb(data.length)}`);
  }
}

console.log(
  `${originals.length} originals (${kb(originalBytes)}); ` +
    `${written + unchanged} copies (${kb(copyBytes)}): ${written} written, ${unchanged} unchanged`
);
