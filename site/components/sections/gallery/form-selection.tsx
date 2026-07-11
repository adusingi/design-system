import { FormField, Input, Progress, Radio, Select, Slider } from "@mobayilo/ui";
import { ShowcasePanel } from "../../showcase-panel";

export function FormAndSelection() {
  return (
    <>
      <ShowcasePanel label="Form">
        <div className="mo-stack">
          <FormField label="Project name">
            <Input defaultValue="bentokumiko" />
          </FormField>
          <FormField label="Environment">
            <Select defaultValue="staging">
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </Select>
          </FormField>
          <FormField label="Webhook URL" error="This URL is unreachable.">
            <Input defaultValue="https://hooks.example/deploy" style={{ borderColor: "#f2453d" }} />
          </FormField>
        </div>
      </ShowcasePanel>

      <ShowcasePanel label="Selection & progress">
        <div className="mo-stack">
          <div className="mo-flex-wrap">
            <Radio name="release-env" label="Standard" defaultChecked />
            <Radio name="release-env" label="Fast" />
          </div>
          <FormField label="Cache TTL" hint="0 – 300s">
            <Slider defaultValue={90} min={0} max={300} />
          </FormField>
          <FormField label="Build progress">
            <Progress value={72} />
          </FormField>
        </div>
      </ShowcasePanel>
    </>
  );
}
