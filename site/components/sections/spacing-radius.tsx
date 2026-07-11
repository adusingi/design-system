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

const RADII: Array<{ token: string; px: string }> = [
  { token: "sm", px: "8" },
  { token: "md", px: "16" },
  { token: "lg", px: "24" },
  { token: "full", px: "full" },
];

export function SpacingAndRadius() {
  return (
    <section className="mo-container mo-section">
      <div className="mo-gallery-grid">
        <div>
          <SectionHeader index="03" title="Spacing" caption="4px base" />
          <div className="mo-stack">
            {SPACING.map((row) => (
              <div key={row.token} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: 56, fontFamily: "var(--mo-font-mono)", fontSize: "0.75rem", color: "var(--muted-soft)" }}>
                  {row.token} · {row.px}
                </span>
                <span style={{ height: 12, width: row.px, background: "var(--accent)", borderRadius: "var(--mo-radius-full)" }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader index="04" title="Radius & elevation" caption="" />
          <div className="mo-flex-wrap" style={{ marginBottom: 32 }}>
            {RADII.map((row) => (
              <div key={row.token} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    border: "1px solid var(--line-strong)",
                    background: "var(--accent-wash)",
                    borderRadius: row.token === "full" ? "var(--mo-radius-full)" : `var(--mo-radius-${row.token})`,
                    marginBottom: 8,
                  }}
                />
                <span style={{ fontFamily: "var(--mo-font-mono)", fontSize: "0.75rem", color: "var(--muted-soft)" }}>
                  {row.token} · {row.px}
                </span>
              </div>
            ))}
          </div>
          <div className="mo-flex-wrap">
            {(["sm", "md", "lg"] as const).map((level) => (
              <div
                key={level}
                style={{
                  width: 120,
                  height: 64,
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
    </section>
  );
}
