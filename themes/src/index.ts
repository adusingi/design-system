// Server-safe entry: theme data, the CSS-block builder, and the config factory.
// No React, no "use client" — importable from server components and build steps.
// React components live in the "./react" subpath export.

export {
  themes,
  DEFAULT_THEME_ID,
  getThemeById,
  buildThemeStyles,
  type ThemeDefinition,
  type ThemeGroup,
} from "./themes.js";

export {
  createThemeConfig,
  themeBootstrapScript,
  type ThemeConfig,
  type CreateThemeConfigOptions,
} from "./config.js";
