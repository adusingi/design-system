import type { FooterConfig } from "./config.js";
import { assertFooterConfig } from "./config.js";
import { renderFooterInnerHtml } from "./render.js";

/** Server-safe React wrapper over the canonical footer markup. */
export function SiteFooter({ config }: { config: FooterConfig }) {
  assertFooterConfig(config);
  return (
    <footer
      className={`mo-footer mo-footer--${config.variant ?? "compact"}`}
      dangerouslySetInnerHTML={{ __html: renderFooterInnerHtml(config) }}
    />
  );
}
