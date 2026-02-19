import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const minioHost = process.env.NEXT_PUBLIC_MINIO_HOST;
if (!minioHost) {
  throw new Error("NEXT_PUBLIC_MINIO_HOST is not set");
}

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
        hostname: minioHost,
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
