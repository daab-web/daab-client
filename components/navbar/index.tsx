import { BottomNavigationMenu } from "./bottom";
import { LogoSection, ControlsSection } from "./top";

export default async function Navbar() {
  return (
    <div className="w-full max-w-7xl px-4">
      <div className="flex min-h-16 items-center justify-between gap-4 md:min-h-20">
        <LogoSection />
        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <BottomNavigationMenu />
        </div>
        <ControlsSection />
      </div>
    </div>
  );
}
