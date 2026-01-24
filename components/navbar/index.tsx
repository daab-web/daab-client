import { Separator } from "../ui/separator";
import { BottomNavigationMenu } from "./bottom";
import { TopNavigation } from "./top";

export default function Navbar() {
  return (
    <div className="flex flex-col gap-4">
      <TopNavigation />
      <Separator className="hidden lg:block" />
      <div className="hidden lg:block">
        <BottomNavigationMenu />
      </div>
    </div>
  );
}
