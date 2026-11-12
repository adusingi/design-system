import { ColorTokens } from "../components/sections/color-tokens";
import { ComponentsGallery } from "../components/sections/components-gallery";
import { FooterShowcase } from "../components/sections/footer-showcase";
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
      <FooterShowcase />
    </>
  );
}
