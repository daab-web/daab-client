"use client";

import * as React from "react";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { ABOUT_SECTIONS, NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function MobileMenu() {
  return (
    <SidebarProvider
      defaultOpen={false}
      className="inline-flex w-auto flex-none min-h-0"
    >
      <MobileSidebarTrigger />
      <MobileSidebar />
    </SidebarProvider>
  );
}

function MobileSidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Open navigation"
      className="lg:hidden border border-input bg-background"
      onClick={toggleSidebar}
    >
      <MenuIcon className="size-5" />
    </Button>
  );
}

function MobileSidebar() {
  return (
    <Sidebar side="left" collapsible="offcanvas" className="lg:hidden">
      <SidebarContent className="flex h-full flex-col gap-4 p-4">
        <MobileSidebarNav />
      </SidebarContent>
    </Sidebar>
  );
}

function MobileSidebarNav() {
  const tNavigation = useTranslations("Navigation");
  const tGlobal = useTranslations("Global");
  const pathname = usePathname();
  const normalizedPath = React.useMemo(() => {
    for (const locale of routing.locales) {
      const prefix = `/${locale}`;
      if (pathname === prefix) {
        return "/";
      }
      if (pathname.startsWith(`${prefix}/`)) {
        return pathname.slice(prefix.length);
      }
    }
    return pathname;
  }, [pathname]);
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const [aboutOpen, setAboutOpen] = React.useState(() =>
    normalizedPath.startsWith("/about"),
  );

  React.useEffect(() => {
    const isOpen = isMobile ? openMobile : open;
    if (!isOpen) {
      setAboutOpen(normalizedPath.startsWith("/about"));
    }
  }, [isMobile, open, openMobile, normalizedPath]);

  const closeSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  }, [isMobile, setOpen, setOpenMobile]);

  const handleNavigate = React.useCallback(() => {
    setAboutOpen(false);
    closeSidebar();
  }, [closeSidebar]);

  return (
    <React.Fragment>
      <SidebarHeader className="px-1 text-lg font-semibold">
        {tGlobal("title")}
      </SidebarHeader>
      <SidebarMenu>
        {NAV_ITEMS.map((item) => {
          if (item.key === "aboutWaas") {
            const isParentActive = normalizedPath.startsWith("/about");
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  type="button"
                  isActive={isParentActive}
                  aria-expanded={aboutOpen}
                  onClick={() => setAboutOpen((prev) => !prev)}
                  className="flex items-center justify-between"
                >
                  <span>{tNavigation(item.key)}</span>
                  <ChevronDownIcon
                    className={cn(
                      "size-4 transition-transform duration-300",
                      aboutOpen ? "rotate-180" : "rotate-0",
                    )}
                  />
                </SidebarMenuButton>
                <SidebarMenuSub
                  className={cn(
                    "mt-1 flex flex-col gap-1 pl-4",
                    aboutOpen ? "flex" : "hidden",
                  )}
                >
                  {ABOUT_SECTIONS.map((section) => (
                    <SidebarMenuSubButton
                      key={section.id}
                      asChild
                      isActive={normalizedPath === section.path}
                      onClick={handleNavigate}
                    >
                      <Link href={section.path}>
                        {tNavigation(`about.${section.id}`)}
                      </Link>
                    </SidebarMenuSubButton>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            );
          }

          const isActive = normalizedPath === item.href;
          return (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                onClick={handleNavigate}
              >
                <Link href={item.href}>{tNavigation(item.key)}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </React.Fragment>
  );
}
