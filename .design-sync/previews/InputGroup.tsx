import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "daab-client";
import { Search } from "lucide-react";

export function WithIcon() {
  return (
    <div className="w-72">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    </div>
  );
}

export function WithPrefix() {
  return (
    <div className="w-72">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
