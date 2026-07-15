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
import { Button } from "@/components/ui/button"

export function BottomNavigationMenu() {
  const isMobile = useIsMobile();
  const t = useTranslations("Navigation");

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="gap-1">
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.key}>
            <NavigationMenuLink
              asChild
            >
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-4 py-2 text-sm font-medium text-[#274380] hover:bg-[#E8EFFA] dark:text-[#C9D6F0] dark:hover:bg-[#2a3d5a]"
              >
                <Link href={item.href}>{t(item.key)}</Link>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
