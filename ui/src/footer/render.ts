import { assertFooterConfig, type FooterConfig, type FooterText } from "./config.js";

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const valueText = (value: FooterText): string => typeof value === "string" ? value : value.text;
const i18n = (value: FooterText) => typeof value === "string" ? "" : ` data-t="${escape(value.i18n)}"`;
const text = (value: FooterText) => `${escape(valueText(value))}`;

const icons: Record<string, string> = {
  facebook: '<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z"/>',
  linkedin: '<path d="M5.2 7.7a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8ZM3.6 9h3.2v11H3.6V9Zm5.2 0h3.1v1.5h.1A3.4 3.4 0 0 1 15 8.7c3.3 0 3.9 2.2 3.9 5V20h-3.2v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H8.8V9Z"/>',
  x: '<path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3L12 14.6 6.4 21H3.2l7.3-8.4L2.8 3h6.5l4.4 5.9L18.9 3Zm-1.1 16h1.7L8.3 4.9H6.5L17.8 19Z"/>',
  github: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8 1.7 3.3 1.2.1-.7.4-1.2.7-1.5-2.3-.3-4.7-1.2-4.7-5.1 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.9-2.4 4.8-4.7 5.1.4.4.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r=".8" fill="currentColor" stroke="none"/>',
};
const socialIcon = (kind: string) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[kind]}</svg>`;
const renderText = (value: FooterText, className: string) => `<p class="${className}"${i18n(value)}>${text(value)}</p>`;

export function renderFooterInnerHtml(config: FooterConfig): string {
  assertFooterConfig(config);
  const logo = "svg" in config.brand.logo
    ? config.brand.logo.svg
    : `<img class="mo-footer__logo" src="${escape(config.brand.logo.src)}" alt="${text(config.brand.logo.alt)}"${i18n(config.brand.logo.alt)} />`;
  const tag = config.brand.tag === undefined ? "" : `<span class="mo-footer__tag"${i18n(config.brand.tag)}><span class="mo-footer__tag-mark" aria-hidden="true"></span>${text(config.brand.tag)}</span>`;
  const brand = `<div class="mo-footer__brand"><a class="mo-footer__brand-link" href="${escape(config.brand.href)}">${logo}<span class="mo-footer__name"${i18n(config.brand.name)}>${text(config.brand.name)}</span></a><p class="mo-footer__description"${i18n(config.brand.description)}>${text(config.brand.description)}</p>${tag}${config.variant === "full" && config.social?.length ? `<div class="mo-footer__social">${config.social.map((item) => `<a class="mo-footer__social-link" href="${escape(item.href)}" aria-label="${text(item.label)}"${i18n(item.label)} target="_blank" rel="noopener noreferrer">${socialIcon(item.kind)}</a>`).join("")}</div>` : ""}${renderText(config.copyright, "mo-footer__copyright")}</div>`;
  const count = Math.min(config.columns.length, 4);
  const columns = `<div class="mo-footer__columns mo-footer__columns--${count}">${config.columns.map((column) => `<nav class="mo-footer__column" aria-label="${text(column.title)}"><p class="mo-footer__title"${i18n(column.title)}>${text(column.title)}</p><ul>${column.links.map((link) => `<li><a href="${escape(link.href)}"${i18n(link.label)}${link.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text(link.label)}</a></li>`).join("")}</ul></nav>`).join("")}</div>`;
  const bottom = config.variant === "full" && (config.bottom?.left || config.bottom?.right)
    ? `<div class="mo-footer__bottom">${config.bottom.left ? `<span${i18n(config.bottom.left)}>${text(config.bottom.left)}</span>` : ""}${config.bottom.right ? `<span${i18n(config.bottom.right)}>${text(config.bottom.right)}</span>` : ""}</div>` : "";
  return `<div class="mo-footer__inner">${brand}${columns}</div>${bottom}`;
}

export function renderFooterHtml(config: FooterConfig): string {
  assertFooterConfig(config);
  return `<footer class="mo-footer mo-footer--${config.variant ?? "compact"}">${renderFooterInnerHtml(config)}</footer>`;
}
