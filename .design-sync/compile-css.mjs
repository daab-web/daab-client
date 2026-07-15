// Compiles app/globals.css (Tailwind v4) into a static stylesheet for the
// design-sync bundle. Tailwind v4's postcss plugin auto-detects content from
// the repo root, so every utility class used by components/** is emitted.
import postcss from "../node_modules/postcss/lib/postcss.js";
import tailwind from "../node_modules/@tailwindcss/postcss/dist/index.mjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(repoRoot, "app/globals.css");
const out = resolve(repoRoot, ".design-sync/.cache/compiled.css");

const css = readFileSync(input, "utf8");
const result = await postcss([tailwind({ base: repoRoot })]).process(css, {
  from: input,
  to: out,
});
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, result.css);
console.log(`compiled ${result.css.length} bytes -> ${out}`);
