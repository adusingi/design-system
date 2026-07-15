import { SectionHeader } from "../section-header";
import { Alerts } from "./gallery/alerts";
import { ButtonsAndBadges } from "./gallery/buttons-badges";
import { CardAndDialog } from "./gallery/card-dialog";
import { EntryCards } from "./gallery/entry-cards";
import { FormAndSelection } from "./gallery/form-selection";
import { InputsAndAvatars } from "./gallery/inputs-avatars";
import { SignIn } from "./gallery/sign-in";

export function ComponentsGallery() {
  return (
    <section id="components" className="mo-section" style={{ paddingBottom: 0 }}>
      <div className="mo-container">
        <SectionHeader
          namespace="@mobayilo/ui"
          title="Exhibits keep their borders."
          caption="Components sit directly on a shifted ground — the only boxes here are the components themselves."
        />
      </div>
      {/* One full-bleed panel-soft field instead of a grid of bordered panels. */}
      <div className="mo-field">
        <div className="mo-container mo-exhibit-grid">
          <ButtonsAndBadges />
          <InputsAndAvatars />
          <CardAndDialog />
          <FormAndSelection />
          <Alerts />
          <SignIn />
          <div style={{ gridColumn: "1 / -1" }}>
            <EntryCards />
          </div>
        </div>
      </div>
    </section>
  );
}
