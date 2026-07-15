import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Label,
  Button,
} from "daab-client";

export function Default() {
  return (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-3 pt-3">
        <div className="grid gap-2">
          <Label htmlFor="t-name">Name</Label>
          <Input id="t-name" defaultValue="Ada Lovelace" />
        </div>
        <Button>Save</Button>
      </TabsContent>
      <TabsContent value="password" className="pt-3 text-muted-foreground">
        Change your password here.
      </TabsContent>
    </Tabs>
  );
}

export function Line() {
  return (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-3 text-muted-foreground">
        A summary of your workspace.
      </TabsContent>
    </Tabs>
  );
}
