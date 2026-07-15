import { Drawdown } from "./drawdown";

export function Hero() {
  return (
    <section className="mo-hero">
      <div className="mo-container">
        <p className="mo-hero-kicker">@mobayilo — themes · ui · auth-magic-link</p>
        <h1 className="mo-hero-title">
          One system, <em>eleven inks</em>.
        </h1>
        <p className="mo-hero-lede">
          Tokens and components shared across Academy, Bento, Network, and Umuzika. Plain CSS, zero drift. Every
          color on this page is a live token — including the ink poured below.
        </p>
        <p className="mo-reink-hint">
          Press <span className="mo-reink-key">/</span> to re-ink the page with the next theme.
        </p>
      </div>
      <Drawdown />
    </section>
  );
}
