import type { ReactNode } from "react";

// Shared by not-found.tsx and error.tsx — same hero-scale drawdown treatment
// as the homepage, so a wrong turn still reads as part of the specimen sheet.
export function ErrorState({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions: ReactNode;
}) {
  return (
    <section className="mo-error-page">
      <div className="mo-container">
        <p className="mo-hero-kicker">{eyebrow}</p>
        <h1 className="mo-hero-title">{title}</h1>
        <p className="mo-hero-lede">{description}</p>
        <div className="mo-flex-wrap" style={{ marginTop: "var(--mo-space-2xl)" }}>
          {actions}
        </div>
      </div>
    </section>
  );
}
