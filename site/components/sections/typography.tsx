import { SectionHeader } from "../section-header";

// A true waterfall specimen: every step at real size with a mono annotation
// above it. Size contrast separates the rows — no rules between them. The
// display step gets a site-local clamp so Cormorant can actually perform;
// the --mo-text-display token itself stays at 3.5rem (sized for product UIs).
const SCALE: Array<{ token: string; annotation: string; sample: string; className?: string }> = [
  { token: "display", annotation: "display · 3.5rem / 1.05 · 700", sample: "Academy, Bento, Network & Umuzika", className: "mo-waterfall-display" },
  { token: "h1", annotation: "h1 · 2.5rem / 1.15 · 700", sample: "Consistent building blocks" },
  { token: "h2", annotation: "h2 · 2rem / 1.2 · 600", sample: "Built once, reused everywhere" },
  { token: "h3", annotation: "h3 · 1.375rem / 1.35 · 600", sample: "Same auth, same theming, every project" },
  { token: "body-lg", annotation: "body-lg · 1.125rem / 1.55 · 400", sample: "Ten themes, one component library, zero drift." },
  { token: "body", annotation: "body · 1rem / 1.6 · 400", sample: "Import the stylesheet, wrap your app in ThemeProvider, and go." },
  { token: "caption", annotation: "caption · 0.8125rem / 1.4 · 500", sample: "SHARED ACROSS ACADEMY, BENTO, NETWORK & UMUZIKA" },
];

export function Typography() {
  return (
    <section id="typography" className="mo-section">
      <div className="mo-container">
        <SectionHeader
          namespace="--mo-text-*"
          title="Type set at true size."
          caption="Cormorant Garamond for display and headings, Inconsolata for everything else."
        />
        <div className="mo-waterfall">
          {SCALE.map((row) => (
            <div key={row.token}>
              <p className="mo-annotation">{row.annotation}</p>
              {/* The display row is styled entirely by its class — an inline
                  `font` shorthand would override the specimen-scale clamp. */}
              <p className={row.className} style={row.className ? { margin: 0 } : { font: `var(--mo-text-${row.token})`, margin: 0 }}>
                {row.sample}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
