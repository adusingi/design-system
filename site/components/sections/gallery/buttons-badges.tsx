import { Badge, Button } from "@mobayilo/ui";
import { ShowcasePanel } from "../../showcase-panel";

export function ButtonsAndBadges() {
  return (
    <>
      <ShowcasePanel label="Buttons">
        <div className="mo-flex-wrap">
          <Button variant="primary">Ship it</Button>
          <Button variant="accent">Get started</Button>
          <Button variant="outline">Watch the demo</Button>
          <Button variant="danger" size="sm">
            Delete branch
          </Button>
          <Button variant="ghost" size="sm">
            Learn more →
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </ShowcasePanel>

      <ShowcasePanel label="Badges & tags">
        <div className="mo-flex-wrap">
          <Badge variant="success">Deployed</Badge>
          <Badge variant="warning">Preview</Badge>
          <Badge variant="danger">Failing</Badge>
          <Badge variant="info">New theme</Badge>
          <Badge variant="default">Academy</Badge>
          <Badge variant="outline">Bento</Badge>
        </div>
      </ShowcasePanel>
    </>
  );
}
