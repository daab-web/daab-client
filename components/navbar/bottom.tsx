"use client";

import * as React from "react";
import Link from "next/link";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/lib/navigation";

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
              className={navigationMenuTriggerStyle()}
            >
              <Link href={item.href} className="text-sm px-3">
                {t(item.key)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
