import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "daab-client";

export function Default() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>Summary of activity for June 2026.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Revenue is up 12% over the previous period, with 1,284 new accounts
          created this month.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Dismiss</Button>
        <Button>View details</Button>
      </CardFooter>
    </Card>
  );
}

export function WithAction() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Billed annually per seat.</CardDescription>
        <CardAction>
          <Badge>Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          $24<span className="text-sm text-muted-foreground">/mo</span>
        </p>
      </CardContent>
    </Card>
  );
}

export function Small() {
  return (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>18.2 GB of 25 GB used</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-3/4 rounded-full bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
