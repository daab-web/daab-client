"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function AuthPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get("redirect") || "/admin";
    window.location.href = `/api/auth/login?redirect=${encodeURIComponent(redirect)}`;
  }, [searchParams]);

  return (
    <div className="flex-1 flex items-start justify-center px-4 pt-24">
      <div
        className="flex flex-col items-center gap-10 rounded-3xl border border-[#c8d5ef]/10 backdrop-blur-md px-16 py-14 shadow-2xl"
        style={{
          background:
            "linear-gradient(to bottom, #2b457f26, #0d111a80, #c8d5ef0d)",
        }}
      >
        <Image
          src="/daab-logo.png"
          alt="DAAB"
          width={80}
          height={80}
          className="select-none"
          priority
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-6 text-white/40" />
          <p className="text-base font-medium text-white/90">Signing you in</p>
          <p className="text-sm text-white/40 max-w-xs">
            You're being redirected to the authentication provider
          </p>
        </div>
      </div>
    </div>
  );
}
