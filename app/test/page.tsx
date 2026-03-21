"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function TestPage() {
  const onClick = () => {
    authClient.signIn.oauth2({ providerId: "backend" });
  };

  return <Button onClick={onClick}>Click</Button>;
}
