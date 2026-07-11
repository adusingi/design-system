import { Alert } from "@mobayilo/ui";
import { ShowcasePanel } from "../../showcase-panel";

export function Alerts() {
  return (
    <ShowcasePanel label="Alerts & notifications">
      <div className="mo-stack">
        <Alert variant="success" title="Deploy complete" description="umuzika-saas · production · 42s" />
        <Alert variant="warning" title="Approaching rate limit" description="ZeptoMail: 82% of daily sends used." />
        <Alert variant="danger" title="Build failed" description="network-mobayilo · typecheck exited 1." />
        <Alert variant="info" title="New theme available" description="rose pine dawn just landed in @mobayilo/themes." />
      </div>
    </ShowcasePanel>
  );
}
