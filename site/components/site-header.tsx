"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@mobayilo/themes/react";

const NAV_LINKS = [
  { href: "#tokens", label: "Color" },
  { href: "#typography", label: "Type" },
  { href: "#geometry", label: "Space" },
  { href: "#components", label: "Components" },
];

export function SiteHeader() {
  // No border-bottom: the header separates from content with blur while the
  // page is at rest, and a soft shadow only once content scrolls beneath it.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "color-mix(in srgb, var(--background) 82%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 1px 2px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.10)" : "none",
        transition: "box-shadow 200ms ease",
      }}
    >
      <div
        className="mo-container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}
      >
        <span
          style={{
            fontFamily: "var(--mo-font-heading)",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "1.375rem",
            letterSpacing: "0.01em",
          }}
        >
          Mobayilo
        </span>
        <nav className="mo-flex-wrap" style={{ gap: 24 }}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: "0.8125rem", color: "var(--muted)", textDecoration: "none" }}>
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
