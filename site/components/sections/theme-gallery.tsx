"use client";

import { useTheme } from "@mobayilo/themes/react";
import type { ThemeDefinition } from "@mobayilo/themes";

function ThemePreviewCard({
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
      className="mo-theme-preview"
      style={{ background: v.panel, borderColor: active ? v["line-strong"] : v.line }}
      onClick={() => onSelect(theme.id)}
      onMouseEnter={() => onHoverStart(theme.id)}
      onMouseLeave={onHoverEnd}
    >
      <span className="mo-theme-preview-swatches">
        <span style={{ background: v.background }} />
        <span style={{ background: v.accent }} />
        <span style={{ background: v.foreground }} />
      </span>
      <span className="mo-theme-preview-label" style={{ color: v.foreground }}>
        {theme.label}
        {active && " ✓"}
      </span>
      <span className="mo-theme-preview-group" style={{ color: v["muted-soft"] }}>
        {theme.group}
      </span>
    </button>
  );
}

export function ThemeGallery() {
  const { config, currentThemeId, setTheme, previewTheme } = useTheme();

  return (
    <div className="mo-swatch-group">
      <p className="mo-swatch-group-label">All {config.themes.length} themes — click to switch, hover to preview</p>
      <div className="mo-theme-gallery-grid">
        {config.themes.map((theme) => (
          <ThemePreviewCard
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
