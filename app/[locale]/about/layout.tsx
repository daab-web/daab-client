import * as React from "react";
import { AboutSidebar } from "@/components/about-sidebar";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl flex-col gap-6 px-4 lg:flex-row lg:gap-8">
        <AboutSidebar />
        <main className="flex-1 min-w-0 bg-muted/30 p-4 rounded-md">
          {children}
        </main>
      </div>
    </div>
  );
}
