import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { assertFooterConfig, validateFooterConfig } from "../dist/footer/config.js";
import { renderFooterHtml } from "../dist/footer/render.js";
import { SiteFooter } from "../dist/footer/site-footer.js";

const base = {
  brand: { name: "Sample", href: "/", logo: { src: "/logo.svg", alt: "" }, description: "A sample footer." },
  copyright: "© 2026 Sample",
  columns: [{ title: "Links", links: [{ label: "Home", href: "/" }] }],
};
const cli = fileURLToPath(new URL("../bin/mo-footer.mjs", import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });

test("validator accepts a valid config and reports clear errors", () => {
  assert.deepEqual(validateFooterConfig(base), []);
  const errors = validateFooterConfig({ variant: "broken", brand: {}, copyright: 7, columns: [{ title: "x", links: [{ href: "" }] }] });
  assert.ok(errors.some((error) => error.includes("variant must")));
  assert.ok(errors.some((error) => error.includes("brand.name")));
  assert.ok(errors.some((error) => error.includes("copyright")));
  assert.ok(errors.some((error) => error.includes("columns[0].links[0].label")));
  assert.throws(() => assertFooterConfig(null), /config must be an object/);
});

test("renderer escapes content and attributes while preserving trusted SVG", () => {
  const html = renderFooterHtml({ ...base, brand: { ...base.brand, name: 'A "Brand"', href: '/?a="&b=<', logo: { svg: '<svg viewBox="0 0 1 1"><circle /></svg>' } }, columns: [{ title: "Links", links: [{ label: "<script>alert(1)</script>", href: '/search?q="&x=<' }] }] });
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /href="\/\?a=&quot;&amp;b=&lt;"/);
  assert.match(html, /<svg viewBox="0 0 1 1"><circle \/><\/svg>/);
});

test("renderer emits external-link attributes and translated data-t values", () => {
  const html = renderFooterHtml({ ...base, brand: { ...base.brand, name: { text: "Sample", i18n: "footer.brand" }, description: { text: "A sample.", i18n: "footer.description" } }, copyright: { text: "Copyright", i18n: "footer.copyright" }, columns: [{ title: { text: "Links", i18n: "footer.links" }, links: [{ label: { text: "Docs", i18n: "footer.docs" }, href: "https://example.com", external: true }] }] });
  assert.match(html, /data-t="footer\.brand"/);
  assert.match(html, /data-t="footer\.description"/);
  assert.match(html, /data-t="footer\.copyright"/);
  assert.match(html, /data-t="footer\.links"/);
  assert.match(html, /data-t="footer\.docs"/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
});

test("compact and full variants render the expected optional pieces", () => {
  const compact = renderFooterHtml(base);
  assert.match(compact, /mo-footer--compact/);
  assert.doesNotMatch(compact, /mo-footer__social/);
  const full = renderFooterHtml({ ...base, variant: "full", social: [{ kind: "github", href: "https://github.com/example", label: "GitHub" }], bottom: { left: "Left", right: "Right" } });
  assert.match(full, /mo-footer--full/);
  assert.match(full, /mo-footer__social-link/);
  assert.match(full, /mo-footer__bottom/);
  assert.match(full, /aria-label="Links"/);
});

test("CLI inject/check handle missing markers and current or stale markup", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "mo-footer-test-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const config = join(dir, "footer.json");
  const page = join(dir, "page.html");
  await writeFile(config, JSON.stringify(base));
  await writeFile(page, "<main>Hi</main>\n<!-- mo-footer:start -->old<!-- mo-footer:end -->\n");
  let result = run("check", config, page);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /out of date/);
  result = run("inject", config, page);
  assert.equal(result.status, 0, result.stderr);
  const markup = (await readFile(page, "utf8")).split("<!-- mo-footer:start -->\n")[1].split("\n<!-- mo-footer:end -->")[0];
  assert.equal(markup, renderFooterHtml(base));
  result = run("check", config, page);
  assert.equal(result.status, 0, result.stderr);
  await writeFile(page, "<main>No markers</main>");
  result = run("inject", config, page);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing or misordered footer markers/);
});

test("React server markup equals renderFooterHtml", () => {
  const config = { ...base, variant: "full", social: [{ kind: "instagram", href: "https://instagram.com/sample", label: "Instagram" }], bottom: { left: "Made with care" } };
  assert.equal(renderToStaticMarkup(createElement(SiteFooter, { config })), renderFooterHtml(config));
});
