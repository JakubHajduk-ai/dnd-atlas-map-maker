#!/usr/bin/env node
/**
 * Assembles src/ into a single index.html with no dependencies.
 *
 *   src/shell.html   the editor page skeleton (holds the __CSS__ and __JS__ markers)
 *   src/editor.css   editor styles
 *   src/editor.js    editor logic (holds the __VIEWER__ marker)
 *   src/viewer.html  the whole finished-site template — embedded into editor.js as a string
 *
 * Run:  node build.mjs          one build
 *       node build.mjs --watch  rebuild on every change in src/
 */
import { readFileSync, writeFileSync, watch } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(root, "src", f), "utf8");

function build() {
  const viewer = src("viewer.html");

  // The template goes into JS as a string. `</` has to be broken up, otherwise the
  // HTML parser ends the editor's <script> early.
  const viewerLiteral = JSON.stringify(viewer).replace(/<\//g, "<\\/");

  const js = src("editor.js").replace("__VIEWER__", viewerLiteral);

  const html = src("shell.html")
    .replace("/* __CSS__ */", () => src("editor.css"))
    .replace("/* __JS__ */", () => js);

  writeFileSync(join(root, "index.html"), html);

  const kb = (n) => (n / 1024).toFixed(1) + " kB";
  console.log(
    `index.html  ${kb(html.length)}  (editor ${kb(js.length)}, site template ${kb(viewer.length)})`
  );
}

build();

if (process.argv.includes("--watch")) {
  console.log("Watching src/ …  Ctrl+C quits.");
  let timer = null;
  watch(join(root, "src"), () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (e) {
        console.error("Build failed:", e.message);
      }
    }, 80);
  });
}
