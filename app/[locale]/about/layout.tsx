import * as React from "react";
import { AboutSidebar } from "@/components/about-sidebar";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full justify-center py-4 md:py-6">
      <div className="flex w-full max-w-6xl flex-col gap-5 px-4 lg:flex-row lg:gap-8">
        <AboutSidebar />
        <main className="min-w-0 flex-1 rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm backdrop-blur-sm md:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
