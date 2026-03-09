import { type ReactNode } from "react";
import { CheckCircle2, Target, Eye, Heart, FileText } from "lucide-react";
import { type AboutSectionId, ABOUT_SECTIONS } from "@/lib/navigation";
import { Separator } from "./ui/separator";

const sectionIcons = {
  necessity: CheckCircle2,
  mission: Target,
  vision: Eye,
  values: Heart,
  charter: FileText,
};

type Props = {
  sectionId: AboutSectionId;
  title: string;
  children: ReactNode;
};

export function AboutSectionWrapper({ sectionId, title, children }: Props) {
  const Icon = sectionIcons[sectionId];
  const currentIndex = ABOUT_SECTIONS.findIndex((s) => s.id === sectionId);
  const total = ABOUT_SECTIONS.length;

  return (
    <div className="flex flex-col gap-6 py-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1e3a6e] animate-in zoom-in duration-500 delay-100">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-0.5 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Section
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        </div>
      </div>
      <Separator className="animate-in fade-in duration-500 delay-200" />

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
        {children}
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2 animate-in fade-in duration-500 delay-500">
        <span className="text-sm text-muted-foreground">
          Section {currentIndex + 1} of {total}
        </span>
        <div className="flex items-center gap-1.5">
          {ABOUT_SECTIONS.map((_, i) => (
            <div
              key={i}
              className={
                i === currentIndex
                  ? "h-2 w-6 rounded-full bg-[#1e3a6e] animate-in zoom-in duration-300"
                  : "h-2 w-2 rounded-full bg-muted-foreground/30"
              }
              style={{ animationDelay: `${600 + i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
