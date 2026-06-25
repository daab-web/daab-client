import { ScrollArea, Separator } from "daab-client";

const tags = Array.from({ length: 24 }, (_, i) => `v1.2.0-beta.${24 - i}`);

export function Default() {
  return (
    <ScrollArea className="h-56 w-56 rounded-md border">
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Recent tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="py-1.5 text-sm">{tag}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
