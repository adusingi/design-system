import { ColorTokens } from "../components/sections/color-tokens";
import { ComponentsGallery } from "../components/sections/components-gallery";
import { Hero } from "../components/sections/hero";
import { SpacingAndRadius } from "../components/sections/spacing-radius";
import { Typography } from "../components/sections/typography";
import { SiteHeader } from "../components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <ColorTokens />
      <Typography />
      <SpacingAndRadius />
      <ComponentsGallery />
      <footer className="mo-container" style={{ padding: "48px 24px", borderTop: "1px solid var(--line)", color: "var(--muted-soft)", fontSize: "0.8125rem" }}>
        @mobayilo/themes · @mobayilo/ui · @mobayilo/auth-magic-link — built once, shared across every project.
      </footer>
    </>
  );
}
