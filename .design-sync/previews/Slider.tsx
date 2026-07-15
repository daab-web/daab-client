import { Slider } from "daab-client";

export function Single() {
  return (
    <div className="w-72">
      <Slider defaultValue={[33]} max={100} step={1} />
    </div>
  );
}

export function Range() {
  return (
    <div className="w-72">
      <Slider defaultValue={[20, 80]} max={100} step={1} />
    </div>
  );
}
