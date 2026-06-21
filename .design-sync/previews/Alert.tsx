import { Alert, AlertTitle, AlertDescription } from "daab-client";
import { CircleAlert, Rocket, TriangleAlert } from "lucide-react";

export function Default() {
  return (
    <Alert className="max-w-md">
      <Rocket />
      <AlertTitle>Deployment successful</AlertTitle>
      <AlertDescription>
        Your changes are live. It may take a few minutes to propagate across all
        regions.
      </AlertDescription>
    </Alert>
  );
}

export function Destructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <CircleAlert />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your card was declined. Update your billing details to restore service.
      </AlertDescription>
    </Alert>
  );
}

export function TitleOnly() {
  return (
    <Alert className="max-w-md">
      <TriangleAlert />
      <AlertTitle>Your trial ends in 3 days.</AlertTitle>
    </Alert>
  );
}
