import { Button } from "daab-client";
import { ArrowRight, Check, Plus, Trash2 } from "lucide-react";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="ghost">Dismiss</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Learn more</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Plus /> New project
      </Button>
      <Button variant="secondary">
        Continue <ArrowRight />
      </Button>
      <Button variant="outline" size="icon" aria-label="Confirm">
        <Check />
      </Button>
      <Button variant="destructive" size="icon" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Enabled</Button>
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Outline disabled
      </Button>
    </div>
  );
}
