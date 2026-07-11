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
    <section id="components" className="mo-container mo-section">
      <SectionHeader index="05" title="Components" caption="Built from the tokens above" />
      <div className="mo-gallery-grid">
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
    </section>
  );
}
