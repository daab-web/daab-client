"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  PenSquare,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, useSignOut } from "@/hooks/use-session";
import { isAdmin, isScientist } from "@/types/session";

const triggerClass =
  "gap-1.5 rounded-full px-3 text-[#274380] hover:bg-[#EAF0FB] dark:text-[#C9D6F0] dark:hover:bg-white/10";

export function AccountMenu() {
  const t = useTranslations("Auth");
  const pathname = usePathname();
  const { user, isLoading } = useSession();
  const signOut = useSignOut();

  if (isLoading) return null;

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className={triggerClass}>
        <a href={`/api/auth/login?redirect=${encodeURIComponent(pathname)}`}>
          <LogIn className="h-4 w-4" />
          <span className="hidden text-xs font-semibold sm:inline">
            {t("signIn")}
          </span>
        </a>
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClass}>
          <UserRound className="h-4 w-4" />
          <span className="hidden max-w-32 truncate text-xs font-semibold sm:inline">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{user.name}</span>
          {user.email && (
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isScientist(user) && !isAdmin(user) && (
          <DropdownMenuItem asChild>
            <NextLink href="/admin/blogs">
              <PenSquare className="h-4 w-4" />
              {t("blogPanel")}
            </NextLink>
          </DropdownMenuItem>
        )}
        {isAdmin(user) && (
          <DropdownMenuItem asChild>
            <NextLink href="/admin">
              <LayoutDashboard className="h-4 w-4" />
              {t("adminPanel")}
            </NextLink>
          </DropdownMenuItem>
        )}
        {(isScientist(user) || isAdmin(user)) && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
