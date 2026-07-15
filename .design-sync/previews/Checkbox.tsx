import { Checkbox, Label } from "daab-client";

export function States() {
  return (
    <div className="flex flex-col gap-3">
      <Label className="flex items-center gap-2">
        <Checkbox /> Unchecked
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox defaultChecked /> Checked
      </Label>
      <Label className="flex items-center gap-2 opacity-50">
        <Checkbox disabled /> Disabled
      </Label>
    </div>
  );
}

export function List() {
  return (
    <div className="flex flex-col gap-3">
      <Label className="flex items-center gap-2">
        <Checkbox defaultChecked /> Email notifications
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox defaultChecked /> Push notifications
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox /> SMS notifications
      </Label>
    </div>
  );
}
