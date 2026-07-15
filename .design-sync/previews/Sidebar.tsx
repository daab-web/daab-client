import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "daab-client";
import { Home, Inbox, Search, Settings } from "lucide-react";

const items = [
  { title: "Home", icon: Home },
  { title: "Inbox", icon: Inbox },
  { title: "Search", icon: Search },
  { title: "Settings", icon: Settings },
];

export function Default() {
  return (
    <SidebarProvider className="h-96 min-h-0 w-64 overflow-hidden rounded-lg border">
      <Sidebar collapsible="none" className="h-full">
        <SidebarHeader className="px-3 py-2 text-sm font-semibold">
          Acme Inc.
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.title === "Home"}>
                      <item.icon /> {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-3 py-2 text-xs text-muted-foreground">
          v1.0.0
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
