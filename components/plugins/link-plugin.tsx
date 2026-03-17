"use client";

import { LinkPlugin as LexicalReactLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import type { JSX } from "react";

const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

export function validateUrl(url: string): boolean {
  try {
    return SUPPORTED_URL_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

interface LinkPluginProps {
  hasLinkAttributes?: boolean;
}

export default function LinkPlugin({
  hasLinkAttributes = false,
}: LinkPluginProps): JSX.Element {
  return (
    <LexicalReactLinkPlugin
      validateUrl={validateUrl}
      attributes={
        hasLinkAttributes
          ? {
              rel: "noopener noreferrer",
              target: "_blank",
            }
          : undefined
      }
    />
  );
}
