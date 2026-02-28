"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ABOUT_SECTIONS } from "@/lib/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AboutSidebar() {
  const t = useTranslations("Navigation.about");
  const pathname = usePathname();

  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-64">
      <Card className="sticky top-24 border-border/70 bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3">
          <nav className="flex flex-col gap-1.5">
            {ABOUT_SECTIONS.map((section) => {
              const isActive = pathname === section.path;
              return (
                <Link
                  key={section.id}
                  href={section.path}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {t(section.id)}
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
