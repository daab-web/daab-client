"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function AboutSidebar() {
  const t = useTranslations("Navigation.about");
  const pathname = usePathname();

  const sections = [
    { id: "necessity", label: t("necessity"), path: "/about/necessity" },
    { id: "mission", label: t("mission"), path: "/about/mission" },
    { id: "vision", label: t("vision"), path: "/about/vision" },
    { id: "values", label: t("values"), path: "/about/values" },
    { id: "charter", label: t("charter"), path: "/about/charter" },
  ];

  return (
    <aside className="w-48 flex-shrink-0">
      <nav className="sticky top-24 flex flex-col gap-1">
        {sections.map((section) => {
          const isActive = pathname === section.path;
          return (
            <Link
              key={section.id}
              href={section.path}
              className={cn(
                "text-sm transition-colors px-3 py-2 rounded-md text-left",
                isActive
                  ? "text-foreground bg-accent font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

