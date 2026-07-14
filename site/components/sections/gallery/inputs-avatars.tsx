import { Avatar, Checkbox, Input, Radio, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from "@mobayilo/ui";
import { ShowcasePanel } from "../../showcase-panel";

export function InputsAndAvatars() {
  return (
    <>
      <ShowcasePanel label="Inputs & controls">
        <div className="mo-stack">
          <Input placeholder="Search projects…" />
          <div className="mo-flex-wrap">
            <Checkbox label="Auto-deploy on merge" defaultChecked />
            <Radio name="env-inline" label="Staging" defaultChecked />
            <Radio name="env-inline" label="Production" />
          </div>
          <Switch label="Send weekly digest" defaultChecked />
        </div>
      </ShowcasePanel>

      <ShowcasePanel label="Avatars & projects">
        <div className="mo-flex-wrap" style={{ marginBottom: 20 }}>
          <Avatar fallback="AC" />
          <Avatar fallback="BT" />
          <Avatar fallback="NW" />
          <Avatar fallback="UM" size="lg" />
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p style={{ font: "var(--mo-text-body)", color: "var(--muted)", margin: 0 }}>
              Nine active projects, one shared component library.
            </p>
          </TabsContent>
          <TabsContent value="team">
            <p style={{ font: "var(--mo-text-body)", color: "var(--muted)", margin: 0 }}>adusingi + collaborators.</p>
          </TabsContent>
          <TabsContent value="activity">
            <p style={{ font: "var(--mo-text-body)", color: "var(--muted)", margin: 0 }}>
              Last change: @mobayilo/ui v0.1.0.
            </p>
          </TabsContent>
        </Tabs>
      </ShowcasePanel>
    </>
  );
}
