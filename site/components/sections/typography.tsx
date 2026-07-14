import { SectionHeader } from "../section-header";

const SCALE: Array<{ token: string; sample: string }> = [
  { token: "display", sample: "The Mobayilo design system" },
  { token: "h1", sample: "Consistent building blocks" },
  { token: "h2", sample: "Built once, reused everywhere" },
  { token: "h3", sample: "Same auth, same theming, every project" },
  { token: "body-lg", sample: "Ten themes, one component library, zero drift." },
  { token: "body", sample: "Import the stylesheet, wrap your app in ThemeProvider, and go." },
  { token: "caption", sample: "SHARED ACROSS ACADEMY, BENTO, NETWORK & UMUZIKA" },
];

export function Typography() {
  return (
    <section id="typography" className="mo-container mo-section">
      <SectionHeader index="02" title="Typography" caption="Cormorant Garamond for headings, Inconsolata for everything else" />

      <div className="mo-gallery-grid" style={{ marginBottom: 40 }}>
        <div className="mo-panel">
          <p className="mo-panel-label">Heading — --mo-font-heading</p>
          <p style={{ font: "var(--mo-text-display)", margin: 0 }}>Aa</p>
          <p style={{ fontFamily: "var(--mo-font-sans)", color: "var(--muted)", fontSize: "0.875rem", marginTop: 12 }}>
            Cormorant Garamond — display and headings only.
          </p>
        </div>
        <div
          className="mo-panel"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          <p className="mo-panel-label" style={{ color: "color-mix(in srgb, var(--background) 60%, transparent)" }}>
            Sans / Mono — --mo-font-sans
          </p>
          <p style={{ font: "var(--mo-text-h2)", fontFamily: "var(--mo-font-heading)", margin: 0 }}>academy · bento</p>
          <p style={{ fontFamily: "var(--mo-font-sans)", fontSize: "0.8125rem", marginTop: 12, opacity: 0.7 }}>
            network · umuzika · veronese
          </p>
        </div>
      </div>

      <div className="mo-stack">
        {SCALE.map((row) => (
          <div key={row.token} style={{ display: "flex", alignItems: "baseline", gap: 24, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            <span style={{ width: 80, flexShrink: 0, fontFamily: "var(--mo-font-mono)", fontSize: "0.75rem", color: "var(--muted-soft)" }}>
              {row.token}
            </span>
            <span style={{ font: `var(--mo-text-${row.token})` }}>{row.sample}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
