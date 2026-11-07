"use client";

import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { PenSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { isScientist } from "@/types/session";

/** Shortcut to the Blogs tab of the panel, where scientists write and manage posts. */
export function AuthorActions() {
  const t = useTranslations("Blog");
  const { user } = useSession();

  if (!isScientist(user)) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button asChild>
        <NextLink href="/admin/blogs">
          <PenSquare className="mr-2 h-4 w-4" />
          {t("blogPanel")}
        </NextLink>
      </Button>
    </div>
  );
}
