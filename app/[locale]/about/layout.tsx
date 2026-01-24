import * as React from "react";
import { AboutSidebar } from "@/components/about-sidebar";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl gap-8 px-4">
        <AboutSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
