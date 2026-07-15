"use client";

import { getThemeById } from "@mobayilo/themes";
import { useTheme } from "@mobayilo/themes/react";

// The hero drawdown: the active theme's tokens poured as full-bleed strata,
// like an ink drawdown card. `dark` marks bands bright enough that the label
// is set in the background color instead of the foreground.
const STRATA: Array<{ token: string; height: number; dark?: boolean }> = [
  { token: "background", height: 44 },
  { token: "panel-soft", height: 36 },
  { token: "panel", height: 36 },
  { token: "accent-wash", height: 32 },
  { token: "accent", height: 44, dark: true },
  { token: "accent-strong", height: 32, dark: true },
  { token: "foreground", height: 44, dark: true },
];

export function Drawdown() {
  const { config, currentThemeId } = useTheme();
  const theme = getThemeById(currentThemeId, config.themes);

  return (
    <div aria-label={`Drawdown of the ${theme.label} theme`}>
      {STRATA.map(({ token, height, dark }) => {
        const ink = dark ? "var(--background)" : "var(--foreground)";
        return (
          <div key={token} className="mo-drawdown-band" style={{ background: `var(--${token})`, height }}>
            <div className="mo-container">
              <span style={{ color: ink }}>{token}</span>
              <span style={{ color: ink, opacity: 0.75 }}>{theme.variables[token]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
