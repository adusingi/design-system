"use client";

import { useTheme } from "@mobayilo/themes/react";
import { getThemeById } from "@mobayilo/themes";
import { SectionHeader } from "../section-header";
import { ThemeGallery } from "./theme-gallery";

// Color is poured, not chipped: each token is a full-bleed band whose height
// maps to the role it plays on a real page — grounds run tall, accents run
// bright, chrome runs thin. `dark` marks bands whose label is set in the
// background color instead of the foreground.
const POUR: Array<{ token: string; height: number; note: string; dark?: boolean }> = [
  { token: "background", height: 96, note: "page ground" },
  { token: "panel", height: 72, note: "raised surface" },
  { token: "panel-soft", height: 72, note: "recessed surface" },
  { token: "foreground", height: 96, note: "ink", dark: true },
  { token: "muted", height: 56, note: "secondary ink", dark: true },
  { token: "muted-soft", height: 44, note: "tertiary ink", dark: true },
  { token: "accent", height: 96, note: "the brand moment", dark: true },
  { token: "accent-strong", height: 56, note: "hover & emphasis", dark: true },
  { token: "accent-wash", height: 44, note: "tint for chips & fills" },
  { token: "chip-background", height: 40, note: "chip ground" },
];

export function ColorTokens() {
  const { config, currentThemeId } = useTheme();
  const theme = getThemeById(currentThemeId, config.themes);

  return (
    <section id="tokens" className="mo-section">
      <div className="mo-container">
        <SectionHeader
          namespace="@mobayilo/themes"
          title="Color is poured, not chipped."
          caption={`Active theme: ${theme.label} — each token at the scale it plays on a real page.`}
        />
      </div>

      <div>
        {POUR.map(({ token, height, note, dark }) => {
          const ink = dark ? "var(--background)" : "var(--foreground)";
          const band = (
            <div key={token} className="mo-pour-band" style={{ background: `var(--${token})`, height }}>
              <div className="mo-container">
                <span className="mo-pour-name" style={{ color: ink }}>
                  {token} <span className="mo-pour-note">— {note}</span>
                </span>
                <span className="mo-pour-value" style={{ color: ink }}>
                  {theme.variables[token]}
                </span>
              </div>
            </div>
          );
          if (token !== "panel-soft") return band;
          // After panel-soft, the `line` token appears as an actual hairline —
          // the one border on this page that is the content.
          return (
            <div key={token}>
              {band}
              <div className="mo-container mo-line-token">
                <span className="mo-pour-name">line</span>
                <span className="mo-line-token-rule" />
                <span className="mo-pour-value">{theme.variables.line} — the token that owns every hairline</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mo-container">
        <ThemeGallery />
      </div>
    </section>
  );
}
