"use client";

import { useTheme } from "@mobayilo/themes/react";
import { getThemeById } from "@mobayilo/themes";
import { SectionHeader } from "../section-header";

// Only the swatch-able entries — skip *-rgb, *-shadow, and *-gradient, which
// aren't standalone colors.
const SWATCH_KEYS = [
  "background",
  "panel",
  "panel-soft",
  "line",
  "line-strong",
  "foreground",
  "muted",
  "muted-soft",
  "accent",
  "accent-strong",
  "chip-background",
  "chip-foreground",
];

export function ColorTokens() {
  const { config, currentThemeId } = useTheme();
  const theme = getThemeById(currentThemeId, config.themes);

  return (
    <section id="tokens" className="mo-container mo-section">
      <SectionHeader
        index="01"
        title="Color"
        caption={`Active theme: ${theme.label} · switch with the picker in the header, or press "/"`}
      />
      <div className="mo-swatch-row">
        {SWATCH_KEYS.map((key) => (
          <div key={key} className="mo-swatch">
            <div className="mo-swatch-color" style={{ background: `var(--${key})` }} />
            <span className="mo-swatch-name">{key}</span>
            <span className="mo-swatch-value">{theme.variables[key]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
