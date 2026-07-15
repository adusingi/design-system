import { SectionHeader } from "../section-header";

const SPACING: Array<{ token: string; px: number }> = [
  { token: "xs", px: 4 },
  { token: "sm", px: 8 },
  { token: "md", px: 12 },
  { token: "lg", px: 16 },
  { token: "xl", px: 24 },
  { token: "2xl", px: 32 },
  { token: "3xl", px: 48 },
  { token: "4xl", px: 64 },
];

const RADII: Array<{ token: string; label: string }> = [
  { token: "sm", label: "sm · 8" },
  { token: "md", label: "md · 16" },
  { token: "lg", label: "lg · 24" },
  { token: "full", label: "full" },
];

export function SpacingAndRadius() {
  return (
    <section id="geometry" className="mo-section">
      <div className="mo-container">
        <SectionHeader
          namespace="--mo-space-* · --mo-radius-* · --mo-shadow-*"
          title="Geometry you can measure by eye."
        />
        <div className="mo-exhibit-grid">
          <div>
            <p className="mo-annotation">Spacing — 4px base</p>
            <div className="mo-stack">
              {SPACING.map((row) => (
                <div key={row.token} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ width: 64, flexShrink: 0, fontFamily: "var(--mo-font-mono)", fontSize: "0.75rem", color: "var(--muted-soft)" }}>
                    {row.token} · {row.px}
                  </span>
                  <span style={{ height: 14, width: row.px, background: "var(--accent)", borderRadius: "var(--mo-radius-full)" }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mo-annotation">Radius &amp; elevation</p>
            {/* Wash fill shows the curve — no outline needed. */}
            <div className="mo-flex-wrap" style={{ gap: 24, marginBottom: 44 }}>
              {RADII.map((row) => (
                <div key={row.token} style={{ textAlign: "center" }}>
                  <span className="mo-radius-chip" style={{ borderRadius: `var(--mo-radius-${row.token})` }} />
                  <span style={{ fontFamily: "var(--mo-font-mono)", fontSize: "0.75rem", color: "var(--muted-soft)" }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
            {/* The shadow chips keep floating panels — elevation is the content. */}
            <div className="mo-flex-wrap" style={{ gap: 28 }}>
              {(["sm", "md", "lg"] as const).map((level) => (
                <div
                  key={level}
                  style={{
                    width: 128,
                    height: 68,
                    borderRadius: "var(--mo-radius-md)",
                    background: "var(--panel)",
                    boxShadow: `var(--mo-shadow-${level})`,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--mo-font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--muted-soft)",
                  }}
                >
                  shadow-{level}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
