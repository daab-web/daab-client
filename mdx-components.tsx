import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

function MdxImage({ className, sizes, ...props }: ImageProps) {
  return (
    <div className="my-8 mx-auto w-full max-w-180">
      <Image
        sizes={sizes ?? "(min-width: 1024px) 720px, 100vw"}
        className={cn(
          "mx-auto block h-auto w-full rounded-lg shadow-md",
          className,
        )}
        {...props}
      />
    </div>
  );
}

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-extrabold mb-6 mt-8 first:mt-0 text-center">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mb-3 mt-4">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-7 mb-4 text-foreground text-justify">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="list-disc mb-4 space-y-2 text-foreground ml-6">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal mb-4 space-y-2 text-foreground ml-6">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-7 text-foreground pl-2">{children}</li>
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props) => (
    <img
      {...(props as any)}
      className={cn(
        "my-8 mx-auto block h-auto w-full max-w-180 rounded-lg shadow-md",
        props.className,
      )}
    />
  ),
  Image: (props: ImageProps) => <MdxImage {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
