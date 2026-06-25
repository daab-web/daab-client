import { RadioGroup, RadioGroupItem, Label } from "daab-client";

export function Default() {
  return (
    <RadioGroup defaultValue="comfortable">
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="default" /> Default
      </Label>
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" /> Comfortable
      </Label>
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="compact" /> Compact
      </Label>
    </RadioGroup>
  );
}
