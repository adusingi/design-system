# @mobayilo/themes

Shared theme tokens (CSS variables) plus a React `ThemeProvider`, `ThemeSwitcher`,
and `useTheme` — the same theming used across curator-board, inkoranyamuga, and
mytrip, extracted so each project configures it instead of copying it.

Ships 10 themes (7 dark, 3 light) with `mobayilo` as the default.

## Install

In a monorepo, add as a workspace dependency:

```jsonc
// package.json
"dependencies": { "@mobayilo/themes": "workspace:*" }
```

## Use (Next.js App Router)

**1. Configure once** (server-safe):

```ts
// lib/theme.ts
import { createThemeConfig } from "@mobayilo/themes";
export const themeConfig = createThemeConfig({ storageKey: "mytrip-theme" });
```

**2. Apply before paint + provide + inject styles** in the root layout:

```tsx
// app/layout.tsx
import { themeBootstrapScript } from "@mobayilo/themes";
import { ThemeProvider, ThemeStyles } from "@mobayilo/themes/react";
import { themeConfig } from "@/lib/theme";
import "@mobayilo/themes/styles.css"; // ThemeSwitcher styling

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={themeConfig.defaultThemeId} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript(themeConfig) }} />
      </head>
      <body>
        <ThemeProvider config={themeConfig}>
          <ThemeStyles />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**3. Drop the switcher anywhere:**

```tsx
"use client";
import { ThemeSwitcher } from "@mobayilo/themes/react";
// <ThemeSwitcher />  — opens with "/", ↑↓ to preview, ↵ apply, esc close
```

## Tailwind 4 tokens

Map the CSS variables to Tailwind utilities (`bg-bg`, `text-fg`, `text-accent`, …):

```css
@theme {
  --color-bg: var(--background);
  --color-panel: var(--panel);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-fg: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-soft: var(--muted-soft);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
}
```

## API

| Export | From | Purpose |
|---|---|---|
| `themes`, `getThemeById`, `buildThemeStyles`, `DEFAULT_THEME_ID` | `.` | Theme data + CSS generation (server-safe) |
| `createThemeConfig`, `themeBootstrapScript` | `.` | Per-project config + no-flash script |
| `ThemeProvider`, `useTheme`, `ThemeSwitcher`, `ThemeStyles` | `./react` | Client components |
| `styles.css` | `./styles.css` | Switcher styling (theme-variable based) |

Pass your own `themes` array to `createThemeConfig({ themes })` to extend or
replace the palette.
