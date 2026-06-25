import { Toggle } from "daab-client";
import { Bold, Italic, Underline } from "lucide-react";

export function Variants() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Bold" defaultPressed>
        <Bold />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <Italic />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline /> Underline
      </Toggle>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="Small" variant="outline">
        <Bold />
      </Toggle>
      <Toggle size="default" aria-label="Default" variant="outline">
        <Bold />
      </Toggle>
      <Toggle size="lg" aria-label="Large" variant="outline">
        <Bold />
      </Toggle>
    </div>
  );
}
