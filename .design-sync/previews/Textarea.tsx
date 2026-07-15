import { Textarea, Label } from "daab-client";

export function WithLabel() {
  return (
    <div className="grid w-80 gap-2">
      <Label htmlFor="msg">Your message</Label>
      <Textarea
        id="msg"
        placeholder="Tell us what you think…"
        defaultValue="The new dashboard layout is a big improvement."
      />
    </div>
  );
}

export function Disabled() {
  return (
    <div className="w-80">
      <Textarea placeholder="Comments are closed" disabled />
    </div>
  );
}
