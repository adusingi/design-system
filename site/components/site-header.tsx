"use client";

import { ThemeSwitcher } from "@mobayilo/themes/react";

const NAV_LINKS = [
  { href: "#tokens", label: "Tokens" },
  { href: "#typography", label: "Typography" },
  { href: "#components", label: "Components" },
];

export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        borderBottom: "1px solid var(--line)",
        background: "color-mix(in srgb, var(--background) 88%, transparent)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="mo-container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}
      >
        <span style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>Mobayilo</span>
        <nav className="mo-flex-wrap" style={{ gap: 24 }}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
