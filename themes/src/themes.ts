// Canonical mobayilo theme palette. These definitions are byte-shared across
// projects (curator-board, inkoranyamuga, world-time/mytrip) — the only thing
// that used to differ per project was the storage key and default id, which are
// now configuration (see createThemeConfig). Adding a theme here makes it
// available everywhere.

export type ThemeGroup = "dark" | "light";

export type ThemeDefinition = {
  id: string;
  group: ThemeGroup;
  label: string;
  /** CSS custom-property values, keyed without the leading `--`. */
  variables: Record<string, string>;
};

export const themes: ThemeDefinition[] = [
  {
    // v2 "sharp": flat ground (no page gradient), deeper background, brighter
    // ink, and crisper hairlines — the old radial green tint read as haze.
    id: "mobayilo",
    group: "dark",
    label: "mobayilo",
    variables: {
      background: "#0B1220",
      "background-rgb": "11 18 32",
      panel: "#1A2438",
      "panel-soft": "#131C2E",
      line: "#2C3B55",
      "line-strong": "#22C55E",
      foreground: "#F8FAFC",
      muted: "#94A3B8",
      "muted-soft": "#64748B",
      accent: "#22C55E",
      "accent-strong": "#4ADE80",
      "accent-wash": "rgba(34, 197, 94, 0.16)",
      "chip-background": "#1A2438",
      "chip-foreground": "#4ADE80",
      "card-shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "page-gradient": "none",
    },
  },
  {
    id: "vesper",
    group: "dark",
    label: "vesper",
    variables: {
      background: "#0f111a",
      "background-rgb": "15 17 26",
      panel: "#141726",
      "panel-soft": "#1b1f33",
      line: "#2a2f46",
      "line-strong": "#7fa7ff",
      foreground: "#f3e8e2",
      muted: "#9aa2c1",
      "muted-soft": "#69708b",
      accent: "#89adff",
      "accent-strong": "#c8d8ff",
      "accent-wash": "rgba(137, 173, 255, 0.14)",
      "chip-background": "#1d2236",
      "chip-foreground": "#c9d7ff",
      "card-shadow": "0 18px 50px rgba(3, 5, 14, 0.34)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(137, 173, 255, 0.16), transparent 32%), linear-gradient(180deg, #121523 0%, #0f111a 100%)",
    },
  },
  {
    id: "catppuccin",
    group: "dark",
    label: "catppuccin",
    variables: {
      background: "#1e1e2e",
      "background-rgb": "30 30 46",
      panel: "#181825",
      "panel-soft": "#24273a",
      line: "#45475a",
      "line-strong": "#89b4fa",
      foreground: "#cdd6f4",
      muted: "#bac2de",
      "muted-soft": "#9399b2",
      accent: "#89b4fa",
      "accent-strong": "#b4befe",
      "accent-wash": "rgba(137, 180, 250, 0.18)",
      "chip-background": "#313244",
      "chip-foreground": "#f5c2e7",
      "card-shadow": "0 18px 50px rgba(8, 10, 22, 0.38)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(245, 194, 231, 0.14), transparent 32%), linear-gradient(180deg, #24273a 0%, #1e1e2e 100%)",
    },
  },
  {
    id: "tokyo-night",
    group: "dark",
    label: "tokyo night",
    variables: {
      background: "#151a2d",
      "background-rgb": "21 26 45",
      panel: "#1a1f37",
      "panel-soft": "#242b45",
      line: "#3b4261",
      "line-strong": "#7aa2f7",
      foreground: "#d5d6db",
      muted: "#a9b1d6",
      "muted-soft": "#7982a9",
      accent: "#7aa2f7",
      "accent-strong": "#bb9af7",
      "accent-wash": "rgba(122, 162, 247, 0.16)",
      "chip-background": "#242b45",
      "chip-foreground": "#c0caf5",
      "card-shadow": "0 18px 50px rgba(6, 8, 20, 0.36)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(122, 162, 247, 0.18), transparent 34%), linear-gradient(180deg, #1a1f37 0%, #151a2d 100%)",
    },
  },
  {
    id: "gruvbox",
    group: "dark",
    label: "gruvbox",
    variables: {
      background: "#1d2021",
      "background-rgb": "29 32 33",
      panel: "#282828",
      "panel-soft": "#32302f",
      line: "#504945",
      "line-strong": "#d79921",
      foreground: "#ebdbb2",
      muted: "#d5c4a1",
      "muted-soft": "#a89984",
      accent: "#d79921",
      "accent-strong": "#fabd2f",
      "accent-wash": "rgba(215, 153, 33, 0.16)",
      "chip-background": "#3c3836",
      "chip-foreground": "#fabd2f",
      "card-shadow": "0 18px 50px rgba(0, 0, 0, 0.32)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(250, 189, 47, 0.16), transparent 30%), linear-gradient(180deg, #282828 0%, #1d2021 100%)",
    },
  },
  {
    id: "nord",
    group: "dark",
    label: "nord",
    variables: {
      background: "#2e3440",
      "background-rgb": "46 52 64",
      panel: "#3b4252",
      "panel-soft": "#434c5e",
      line: "#4c566a",
      "line-strong": "#88c0d0",
      foreground: "#eceff4",
      muted: "#d8dee9",
      "muted-soft": "#81a1c1",
      accent: "#88c0d0",
      "accent-strong": "#8fbcbb",
      "accent-wash": "rgba(136, 192, 208, 0.16)",
      "chip-background": "#434c5e",
      "chip-foreground": "#e5e9f0",
      "card-shadow": "0 18px 50px rgba(10, 12, 17, 0.32)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(143, 188, 187, 0.18), transparent 32%), linear-gradient(180deg, #3b4252 0%, #2e3440 100%)",
    },
  },
  {
    id: "osaka-jade",
    group: "dark",
    label: "osaka jade",
    variables: {
      background: "#111c18",
      "background-rgb": "17 28 24",
      panel: "#172420",
      "panel-soft": "#23372b",
      line: "#2e4538",
      "line-strong": "#509475",
      foreground: "#c1c497",
      muted: "#8aaa92",
      "muted-soft": "#53685b",
      accent: "#509475",
      "accent-strong": "#d7c995",
      "accent-wash": "rgba(80, 148, 117, 0.16)",
      "chip-background": "#1f3028",
      "chip-foreground": "#d7c995",
      "card-shadow": "0 18px 50px rgba(0, 0, 0, 0.36)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(80, 148, 117, 0.2), transparent 32%), linear-gradient(180deg, #172420 0%, #111c18 100%)",
    },
  },
  {
    id: "catppuccin-latte",
    group: "light",
    label: "catppuccin latte",
    variables: {
      background: "#eff1f5",
      "background-rgb": "239 241 245",
      panel: "#ffffff",
      "panel-soft": "#e6e9ef",
      line: "#bcc0cc",
      "line-strong": "#7287fd",
      foreground: "#4c4f69",
      muted: "#5c5f77",
      "muted-soft": "#8c8fa1",
      accent: "#7287fd",
      "accent-strong": "#8839ef",
      "accent-wash": "rgba(114, 135, 253, 0.14)",
      "chip-background": "#dce0e8",
      "chip-foreground": "#8839ef",
      "card-shadow": "0 18px 50px rgba(76, 79, 105, 0.10)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(114, 135, 253, 0.14), transparent 32%), linear-gradient(180deg, #f7f7fb 0%, #eff1f5 100%)",
    },
  },
  {
    id: "solarized-light",
    group: "light",
    label: "solarized light",
    variables: {
      background: "#fdf6e3",
      "background-rgb": "253 246 227",
      panel: "#fffdf7",
      "panel-soft": "#eee8d5",
      line: "#d0c7b1",
      "line-strong": "#268bd2",
      foreground: "#586e75",
      muted: "#657b83",
      "muted-soft": "#93a1a1",
      accent: "#268bd2",
      "accent-strong": "#2aa198",
      "accent-wash": "rgba(38, 139, 210, 0.12)",
      "chip-background": "#eee8d5",
      "chip-foreground": "#268bd2",
      "card-shadow": "0 18px 50px rgba(88, 110, 117, 0.08)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(42, 161, 152, 0.16), transparent 32%), linear-gradient(180deg, #fefbf1 0%, #fdf6e3 100%)",
    },
  },
  {
    id: "rose-pine-dawn",
    group: "light",
    label: "rose pine dawn",
    variables: {
      background: "#faf4ed",
      "background-rgb": "250 244 237",
      panel: "#fffaf4",
      "panel-soft": "#f2e9e1",
      line: "#dfdad9",
      "line-strong": "#907aa9",
      foreground: "#575279",
      muted: "#6e6a86",
      "muted-soft": "#9893a5",
      accent: "#907aa9",
      "accent-strong": "#d7827e",
      "accent-wash": "rgba(144, 122, 169, 0.13)",
      "chip-background": "#f2e9e1",
      "chip-foreground": "#907aa9",
      "card-shadow": "0 18px 50px rgba(87, 82, 121, 0.08)",
      "page-gradient":
        "radial-gradient(circle at top left, rgba(215, 130, 126, 0.15), transparent 32%), linear-gradient(180deg, #fff8f2 0%, #faf4ed 100%)",
    },
  },
  {
    // The other three light themes (catppuccin latte, solarized light, rose
    // pine dawn) are all deliberately tinted off-whites. This is the one with
    // an actually-white background/panel — the light counterpart to the
    // "mobayilo" default. v2 "sharp": flat white (no page gradient), neutrals
    // shifted from the old green-tinted greys to crisp slate, foreground
    // echoes sharp mobayilo's #0B1220 ground; accent stays the AA-safe green.
    id: "paper",
    group: "light",
    label: "paper",
    variables: {
      background: "#ffffff",
      "background-rgb": "255 255 255",
      panel: "#ffffff",
      "panel-soft": "#EEF2F7",
      line: "#DCE3EC",
      "line-strong": "#15803d",
      foreground: "#0B1220",
      muted: "#475569",
      "muted-soft": "#94a3b8",
      accent: "#15803d",
      "accent-strong": "#16a34a",
      "accent-wash": "rgba(21, 128, 61, 0.12)",
      "chip-background": "#ecfdf3",
      "chip-foreground": "#15803d",
      "card-shadow": "0 12px 32px rgba(11, 18, 32, 0.10)",
      "page-gradient": "none",
    },
  },
];

export const DEFAULT_THEME_ID = "mobayilo";

export function getThemeById(id: string, list: ThemeDefinition[] = themes): ThemeDefinition {
  return list.find((theme) => theme.id === id) ?? list[0];
}

// Generate the `html[data-theme="…"] { --var: value; }` blocks for a theme set.
// Inject the result via a <style> tag (see ThemeStyles in ./react) so a project
// gets every theme without hand-copying CSS.
export function buildThemeStyles(list: ThemeDefinition[] = themes): string {
  return list
    .map(
      (theme) => `html[data-theme="${theme.id}"] {
${Object.entries(theme.variables)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join("\n")}
}`,
    )
    .join("\n\n");
}
