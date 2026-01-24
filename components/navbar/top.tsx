import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LanguageSwitcher } from "../language-switcher";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

export async function TopNavigation() {
  const t = await getTranslations("Global");

  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-[#274380] font-bold min-w-0 flex-none lg:flex-1"
      >
        <Image src="/daab-logo.png" alt="logo" width={80} height={80} />
        <h1 className="hidden lg:block">{t("title")}</h1>
      </Link>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <LanguageSwitcher />
        <MobileMenu />
      </div>
    </div>
  );
}
