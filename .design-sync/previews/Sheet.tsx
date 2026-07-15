import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  Button,
  Input,
  Label,
} from "daab-client";

export function EditProfile() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Update your details, then save to apply.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4">
          <div className="grid gap-2">
            <Label htmlFor="s-name">Name</Label>
            <Input id="s-name" defaultValue="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="s-email">Email</Label>
            <Input id="s-email" defaultValue="ada@example.com" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
