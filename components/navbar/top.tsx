import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LanguageSwitcher } from "../language-switcher";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";

export async function TopNavigation() {
  const t = await getTranslations("Global");

  return (
    <div className="flex justify-between items-center">
      <Link href="/" className="w-1/2 flex items-center gap-2 text-[#274380] dark:text-[#C9D6F0] font-bold">
        <Image src="/daab-logo.png" alt="logo" width={80} height={80} />
        <h1>{t("title")}</h1>
      </Link>
      <div className="flex gap-2">
        <ModeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  );
}
