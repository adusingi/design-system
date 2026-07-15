import { ColorTokens } from "../components/sections/color-tokens";
import { ComponentsGallery } from "../components/sections/components-gallery";
import { Hero } from "../components/sections/hero";
import { SpacingAndRadius } from "../components/sections/spacing-radius";
import { Typography } from "../components/sections/typography";
import { SiteHeader } from "../components/site-header";

// The footer closes the page with a thin echo of the hero drawdown — six
// token strata at 8px — instead of a border-top.
const FOOTER_ECHO = ["panel-soft", "panel", "accent-wash", "accent", "accent-strong", "foreground"];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <ColorTokens />
      <Typography />
      <SpacingAndRadius />
      <ComponentsGallery />
      <footer className="mo-footer">
        <div className="mo-container">
          @mobayilo/themes · @mobayilo/ui · @mobayilo/auth-magic-link — built once, shared across every project.
        </div>
        <div className="mo-footer-echo" aria-hidden="true">
          {FOOTER_ECHO.map((token) => (
            <span key={token} style={{ background: `var(--${token})` }} />
          ))}
        </div>
      </footer>
    </>
  );
}
