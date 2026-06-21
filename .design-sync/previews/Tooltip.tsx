import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "daab-client";

export function Default() {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
