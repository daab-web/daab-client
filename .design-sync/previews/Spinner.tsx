import { Spinner, Button } from "daab-client";

export function Sizes() {
  return (
    <div className="flex items-center gap-6 text-foreground">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  );
}

export function InButton() {
  return (
    <Button disabled>
      <Spinner /> Saving…
    </Button>
  );
}
