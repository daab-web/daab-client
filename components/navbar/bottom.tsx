"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/lib/navigation";

export function BottomNavigationMenu() {
  const isMobile = useIsMobile();
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="gap-1">
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.key}>
            <NavigationMenuLink
              asChild
            >
              <Link className="text-gray-500 font-normal" href={item.href}>{t(item.key)}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
