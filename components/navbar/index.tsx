import { Separator } from "../ui/separator";
import { BottomNavigationMenu } from "./bottom";
import { LogoSection, ControlsSection } from "./top";

export default async function Navbar() {
  return (
    <div className="w-full max-w-7xl px-4">
      <div className="flex min-h-16 items-center justify-between gap-4 md:min-h-20">
        <LogoSection />
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <BottomNavigationMenu />
            <Separator orientation="vertical" />
          </div>
          <ControlsSection />
        </div>
      </div>
    </div>
  );
}
