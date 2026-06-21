import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "95.217.17.141",
      },
      {
        protocol: "https",
        hostname: "api.95.217.17.141.nip.io"
      }
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
