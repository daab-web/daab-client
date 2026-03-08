import { BottomNavigationMenu } from "./bottom";
import { LogoSection, ControlsSection } from "./top";

export default async function Navbar() {
  return (
    <div className="w-full max-w-7xl px-4">
      <div className="flex items-center justify-between">
        <LogoSection />
        <div className="hidden lg:flex flex-1 justify-center px-8">
          <BottomNavigationMenu />
        </div>
        <ControlsSection />
      </div>
    </div>
  );
}
