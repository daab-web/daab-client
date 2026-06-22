import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LanguageSwitcher } from "../language-switcher";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

export async function LogoSection() {
  const t = await getTranslations("Global");

  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-[#274380] dark:text-[#C9D6F0] font-bold shrink-0"
    >
      <Image src="/daab-logo.png" alt="logo" width={40} height={40} />
      <div className="flex flex-col">
        <h1 className="hidden text-foreground lg:block whitespace-nowrap">{t("title-short")}</h1>
        <p className="text-xs hidden font-normal lg:block whitespace-nowrap text-gray-500">{t("title-long")}</p>
      </div>
    </Link>
  );
}

export function ControlsSection() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <ModeToggle />
      <LanguageSwitcher />
      <MobileMenu />
    </div>
  );
}

