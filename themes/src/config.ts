import { DEFAULT_THEME_ID, getThemeById, themes, type ThemeDefinition } from "./themes.js";

export type ThemeConfig = {
  /** localStorage key the chosen theme is persisted under (per project). */
  storageKey: string;
  /** Theme applied when nothing is stored. */
  defaultThemeId: string;
  /** The available themes (defaults to the canonical mobayilo set). */
  themes: ThemeDefinition[];
};

export type CreateThemeConfigOptions = {
  /** Required: unique per project, e.g. "mytrip-theme". */
  storageKey: string;
  defaultThemeId?: string;
  themes?: ThemeDefinition[];
};

// Build the per-project theme configuration once and pass it to ThemeProvider.
export function createThemeConfig(options: CreateThemeConfigOptions): ThemeConfig {
  const list = options.themes ?? themes;
  const fallback = options.defaultThemeId ?? DEFAULT_THEME_ID;
  // Guarantee the default exists in the set.
  const defaultThemeId = getThemeById(fallback, list).id;
  return { storageKey: options.storageKey, defaultThemeId, themes: list };
}

// Inline script (string) that applies the saved theme before first paint, to
// avoid a flash of the default. Drop it in <head> via
// `<script dangerouslySetInnerHTML={{ __html: themeBootstrapScript(config) }} />`.
export function themeBootstrapScript(config: Pick<ThemeConfig, "storageKey" | "defaultThemeId">): string {
  const key = JSON.stringify(config.storageKey);
  const def = JSON.stringify(config.defaultThemeId);
  return `try{var t=localStorage.getItem(${key})||${def};if(t)document.documentElement.dataset.theme=t;}catch(e){}`;
}
