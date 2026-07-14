import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inconsolata } from "next/font/google";
import { createThemeConfig, themeBootstrapScript } from "@mobayilo/themes";
import { ThemeProvider, ThemeStyles } from "@mobayilo/themes/react";

import "@mobayilo/themes/styles.css";
import "@mobayilo/ui/styles.css";
import "@mobayilo/auth-magic-link/styles.css";
import "./globals.css";

const themeConfig = createThemeConfig({ storageKey: "mobayilo-design-system-theme" });

// The actual Mobayilo pairing (see ui/README.md): Cormorant Garamond for
// display/headings, Inconsolata for everything else. next/font self-hosts
// both at build time and exposes them as CSS variables, which globals.css
// then points --mo-font-heading/--mo-font-sans/--mo-font-mono at.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inconsolata",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mobayilo Design System",
  description: "Tokens, typography, and components shared across every Mobayilo project.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme={themeConfig.defaultThemeId}
      className={`${cormorantGaramond.variable} ${inconsolata.variable}`}
      // The bootstrap script below rewrites data-theme from localStorage
      // before hydration, so the attribute legitimately differs from the SSR
      // value. Suppression only applies to this element, not its children.
      suppressHydrationWarning
    >
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
