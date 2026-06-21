import { Badge } from "daab-client";
import { Check, X } from "lucide-react";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <Check /> Active
      </Badge>
      <Badge variant="destructive">
        <X /> Failed
      </Badge>
      <Badge variant="secondary">New</Badge>
    </div>
  );
}
