"use client"

import { editorTheme } from "@/components/editor/theme/theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

function onError(error: any) {
  console.error(error);
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialConfig = {
    namespace: 'MyEditor',
    editorTheme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {children}
    </LexicalComposer>
  );
}
