import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  Button,
  Label,
  Input,
} from "daab-client";

export function Dimensions() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the layout dimensions.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="p-w">Width</Label>
            <Input id="p-w" defaultValue="100%" className="col-span-2 h-7" />
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="p-h">Height</Label>
            <Input id="p-h" defaultValue="24px" className="col-span-2 h-7" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
