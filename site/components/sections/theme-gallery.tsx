"use client";

import { useTheme } from "@mobayilo/themes/react";
import type { ThemeDefinition } from "@mobayilo/themes";

// Borderless drawdown strips: four inks per theme, no outline — the colors
// meeting edge to edge are the boundary. Hover lifts with shadow instead of
// a border-color change.
function ThemeStrip({
  theme,
  active,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: {
  theme: ThemeDefinition;
  active: boolean;
  onSelect: (id: string) => void;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
}) {
  const v = theme.variables;
  return (
    <button
      type="button"
      className="mo-theme-strip"
      aria-pressed={active}
      onClick={() => onSelect(theme.id)}
      onMouseEnter={() => onHoverStart(theme.id)}
      onMouseLeave={onHoverEnd}
    >
      <span className="mo-theme-strip-colors">
        <span style={{ background: v.background }} />
        <span style={{ background: v.panel }} />
        <span style={{ background: v.accent }} />
        <span style={{ background: v.foreground }} />
      </span>
      <span className="mo-theme-strip-label">
        {theme.label}
        {active && " ●"}
      </span>
      <span className="mo-theme-strip-group">{theme.group}</span>
    </button>
  );
}

export function ThemeGallery() {
  const { config, currentThemeId, setTheme, previewTheme } = useTheme();

  return (
    <div>
      <p className="mo-annotation">All {config.themes.length} themes — click to switch, hover to preview</p>
      <div className="mo-theme-strips">
        {config.themes.map((theme) => (
          <ThemeStrip
            key={theme.id}
            theme={theme}
            active={theme.id === currentThemeId}
            onSelect={setTheme}
            onHoverStart={previewTheme}
            onHoverEnd={() => previewTheme(currentThemeId)}
          />
        ))}
      </div>
    </div>
  );
}
