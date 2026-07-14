export function Hero() {
  return (
    <section className="mo-container" style={{ paddingTop: 96, paddingBottom: 80 }}>
      <span className="mo-eyebrow">Foundations &amp; components</span>
      <h1 style={{ font: "var(--mo-text-display)", margin: "24px 0 20px", maxWidth: 760 }}>
        The Mobayilo design system.
      </h1>
      <p style={{ font: "var(--mo-text-body-lg)", color: "var(--muted)", maxWidth: 560, marginBottom: 40 }}>
        One set of tokens and components for every Mobayilo product — Academy, Bento, Network, Umuzika, and the
        rest. Ten themes, plain CSS, zero drift between projects.
      </p>
      <div className="mo-flex-wrap">
        {/* Same-page anchors, not onClick handlers — keeps this a plain Server Component. */}
        <a className="mo-btn mo-btn-primary mo-btn-lg" href="#components">
          Browse components
        </a>
        <a className="mo-btn mo-btn-outline mo-btn-lg" href="#tokens">
          Jump to tokens
        </a>
      </div>
    </section>
  );
}
