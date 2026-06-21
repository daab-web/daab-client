import { Input, Label } from "daab-client";

export function Default() {
  return (
    <div className="w-72">
      <Input placeholder="Search projects…" />
    </div>
  );
}

export function WithLabel() {
  return (
    <div className="grid w-72 gap-2">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" defaultValue="Ada Lovelace" />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-72 gap-3">
      <Input placeholder="Default" />
      <Input placeholder="Disabled" disabled />
      <Input defaultValue="Invalid value" aria-invalid />
    </div>
  );
}
