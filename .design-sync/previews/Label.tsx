import { Label, Input, Checkbox } from "daab-client";

export function WithInput() {
  return (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  );
}

export function WithCheckbox() {
  return (
    <Label className="flex items-center gap-2">
      <Checkbox defaultChecked /> Accept terms and conditions
    </Label>
  );
}
