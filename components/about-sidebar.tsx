"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ABOUT_SECTIONS } from "@/lib/navigation";
import {
  CheckCircle2,
  Target,
  Eye,
  Heart,
  FileText,
  ChevronRight,
} from "lucide-react";

const sectionIcons = {
  necessity: CheckCircle2,
  mission: Target,
  vision: Eye,
  values: Heart,
  charter: FileText,
};

export function AboutSidebar() {
  const t = useTranslations("Navigation.about");
  const pathname = usePathname();

  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-64">
      <div className="sticky top-36 rounded-xl border border-border/70 bg-card/90 backdrop-blur-sm overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
        <div className="px-4 py-4 border-b border-border/70">
          <span className="text-base font-semibold">About</span>
        </div>
        <nav className="flex flex-col p-2 gap-0.5">
          {ABOUT_SECTIONS.map((section) => {
            const isActive = pathname.includes(section.path);
            const Icon = sectionIcons[section.id];
            return (
              <Link
                key={section.id}
                href={section.path}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-out",
                  isActive
                    ? "bg-[#1e3a6e] text-white font-medium shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-300 ease-out",
                    isActive
                      ? "text-white scale-110"
                      : "text-muted-foreground group-hover:scale-110",
                  )}
                />
                <span className="flex-1 leading-5">{t(section.id)}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/70 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
