import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "./admin-sidebar";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import ErrorDisplay from "@/components/error-display";
import "../globals.css";
import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/api";
import { QueryProvider } from "@/components/providers/query-provider";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "WAAS Admin Dashboard",
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const token = jar.get("daab.accessToken");

  if (!token) {
    return <ErrorDisplay type="401" />;
  }

  try {
    var apiResponse = await fetchAPI("/admin", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      cache: "no-cache",
    });

    if (!apiResponse.ok) {
      if (apiResponse.status === 403) {
        return <ErrorDisplay type="403" />;
      }
      return <ErrorDisplay type="500" />;
    }
  } catch (err) {
    return <ErrorDisplay type="500" />;
  }

  return (
    <QueryProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
