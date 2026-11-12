import { SiteFooter, type FooterConfig } from "@mobayilo/ui";
import alignpoll from "../../../ui/examples/footer/alignpoll.json";
import dokoMaps from "../../../ui/examples/footer/doko-maps.json";
import mobayilo from "../../../ui/examples/footer/mobayilo.json";
import classroom from "../../../ui/examples/footer/classroom.json";
import { SectionHeader } from "../section-header";

const samples: Array<{ name: string; config: FooterConfig }> = [
  { name: "AlignPoll", config: alignpoll as FooterConfig },
  { name: "Doko Maps", config: dokoMaps as FooterConfig },
  { name: "Mobayilo · full", config: mobayilo as FooterConfig },
  { name: "Classroom", config: classroom as FooterConfig },
];

export function FooterShowcase() {
  return (
    <section className="mo-section mo-footer-showcase">
      <div className="mo-container">
        <SectionHeader namespace="@mobayilo/ui" title="One footer, every product" caption="Each product supplies only its own footer config. The shared component handles structure, accessibility, and responsive layout." />
      </div>
      <div className="mo-footer-showcase__samples">
        {samples.map(({ name, config }) => (
          <div className="mo-footer-showcase__sample" key={name}>
            <p className="mo-footer-showcase__label">{name}</p>
            <SiteFooter config={config} />
          </div>
        ))}
      </div>
    </section>
  );
}
