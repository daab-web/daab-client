import type { MDXComponents } from "mdx/types";
import Image from "next/image";

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
  img: (props) => {
    // Handle regular img tags
    return <img {...(props as any)} className="my-8 rounded-lg shadow-md mx-auto" />;
  },
  Image: (props: any) => {
    // Handle Next.js Image component from MDX
    return (
      <div className="my-8 flex justify-center">
        <Image {...props} className={props.className || "rounded-lg shadow-md"} />
      </div>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
