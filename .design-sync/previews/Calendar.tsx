import { Calendar } from "daab-client";

export function Single() {
  return (
    <Calendar
      mode="single"
      selected={new Date(2026, 5, 12)}
      defaultMonth={new Date(2026, 5, 1)}
      className="rounded-md border"
    />
  );
}
