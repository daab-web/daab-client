import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Button,
} from "daab-client";
import { ChevronDown, Copy } from "lucide-react";

export function Segmented() {
  return (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  );
}

export function SplitAction() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Copy /> Copy link
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon" aria-label="More">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  );
}

export function WithText() {
  return (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">acme.com</Button>
    </ButtonGroup>
  );
}
