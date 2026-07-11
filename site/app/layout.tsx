import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createThemeConfig, themeBootstrapScript } from "@mobayilo/themes";
import { ThemeProvider, ThemeStyles } from "@mobayilo/themes/react";

import "@mobayilo/themes/styles.css";
import "@mobayilo/ui/styles.css";
import "@mobayilo/auth-magic-link/styles.css";
import "./globals.css";

const themeConfig = createThemeConfig({ storageKey: "mobayilo-design-system-theme" });

export const metadata: Metadata = {
  title: "Mobayilo Design System",
  description: "Tokens, typography, and components shared across every Mobayilo project.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={themeConfig.defaultThemeId}>
      <head>
        {/* Applies the persisted theme before first paint to avoid a flash. */}
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
