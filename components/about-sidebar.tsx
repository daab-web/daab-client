"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ABOUT_SECTIONS } from "@/lib/navigation";

export function AboutSidebar() {
  const t = useTranslations("Navigation.about");
  const pathname = usePathname();

  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-48">
      <nav className="sticky top-24 flex flex-col gap-1">
        {ABOUT_SECTIONS.map((section) => {
          const isActive = pathname === section.path;
          return (
            <Link
              key={section.id}
              href={section.path}
              className={cn(
                "text-sm transition-colors px-3 py-2 rounded-md text-left",
                isActive
                  ? "text-[#274380] dark:text-[#C9D6F0] bg-accent font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {t(section.id)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
