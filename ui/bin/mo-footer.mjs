#!/usr/bin/env node
import { readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderFooterHtml } from "../dist/footer/render.js";
import { assertFooterConfig } from "../dist/footer/config.js";

const here = dirname(fileURLToPath(import.meta.url));
const START = "<!-- mo-footer:start -->";
const END = "<!-- mo-footer:end -->";
const HELP = `mo-footer — render and maintain the shared Mobayilo site footer

Usage:
  mo-footer render <config.json> [--out file]
  mo-footer inject <config.json> <page.html>...
  mo-footer check <config.json> <page.html>...
  mo-footer css --out <file>

Pages must contain both markers around the footer:
  ${START}\n  ...\n  ${END}

Examples:
  mo-footer render footer.json --out footer.html
  mo-footer inject footer.json public/index.html
  mo-footer check footer.json public/*.html
  mo-footer css --out public/footer.css`;

function fail(message) { console.error(`mo-footer: ${message}`); process.exitCode = 1; }
async function configAt(path) {
  let value;
  try { value = JSON.parse(await readFile(path, "utf8")); }
  catch (error) { throw new Error(`cannot read config ${path}: ${error.message}`); }
  assertFooterConfig(value);
  return value;
}
function locate(markup, path) {
  const start = markup.indexOf(START);
  const end = markup.indexOf(END);
  if (start < 0 || end < 0 || end < start) throw new Error(`${path}: missing or misordered footer markers`);
  return { start: start + START.length, end };
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "--help" || command === "-h" || command === "help") { console.log(HELP); }
  else if (command === "css") {
    const outIndex = args.indexOf("--out");
    if (outIndex < 0 || !args[outIndex + 1]) throw new Error("css requires --out <file>");
    await copyFile(resolve(here, "../footer.css"), resolve(args[outIndex + 1]));
  } else {
    if (!["render", "inject", "check"].includes(command)) throw new Error(`unknown command '${command}'`);
    const configPath = args[0];
    if (!configPath) throw new Error(`${command} requires <config.json>`);
    const config = await configAt(configPath);
    const html = renderFooterHtml(config);
    if (command === "render") {
      const outIndex = args.indexOf("--out");
      if (outIndex >= 0) {
        const out = args[outIndex + 1];
        if (!out) throw new Error("render --out requires a file");
        await writeFile(resolve(out), `${html}\n`);
      } else process.stdout.write(`${html}\n`);
    } else {
      const pages = args.slice(1).filter((arg, i, all) => arg !== "--out" && all[i - 1] !== "--out");
      if (!pages.length) throw new Error(`${command} requires one or more <page.html> files`);
      let mismatch = false;
      for (const page of pages) {
        const path = resolve(page);
        const source = await readFile(path, "utf8");
        const region = locate(source, page);
        const current = source.slice(region.start, region.end).trim();
        if (command === "inject") {
          const next = `${source.slice(0, region.start)}\n${html}\n${source.slice(region.end)}`;
          await writeFile(path, next);
        } else if (current !== html) {
          console.error(`${page}: footer is out of date`);
          mismatch = true;
        }
      }
      if (mismatch) process.exitCode = 1;
    }
  }
} catch (error) { fail(error.message); }
