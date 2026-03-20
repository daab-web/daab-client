"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ImageNode } from "./nodes/image-node";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { SerializedEditorState } from "lexical";

const theme = {
  paragraph: "mb-2 text-base",
  heading: {
    h1: "text-3xl font-bold mb-4 mt-6",
    h2: "text-2xl font-bold mb-3 mt-5",
    h3: "text-xl font-bold mb-2 mt-4",
    h4: "text-lg font-semibold mb-2 mt-3",
    h5: "text-base font-semibold mb-2 mt-2",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-6 mb-2",
    ul: "list-disc ml-6 mb-2",
    listitem: "mb-1",
  },
  link: "text-primary underline cursor-pointer",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-muted px-1 py-0.5 rounded text-sm font-mono",
  },
  code: "bg-muted block p-2 rounded font-mono text-sm my-2",
  quote: "border-l-4 border-muted-foreground pl-4 italic my-4",
  image: "inline-block",
};

function onError(error: Error) {
  console.error(error);
}

interface NewsViewerProps {
  editorState: SerializedEditorState | undefined;
}

function ViewerContent({
  editorState,
}: {
  editorState: SerializedEditorState | undefined;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editorState) {
      queueMicrotask(() => {
        const parsedState = editor.parseEditorState(editorState);
        editor.setEditorState(parsedState);
      });
    }
  }, [editor, editorState]);

  return null;
}

export default function NewsViewer({ editorState }: NewsViewerProps) {
  const initialConfig = {
    namespace: "NewsViewer",
    theme,
    onError,
    editable: false,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ViewerContent editorState={editorState} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="outline-none focus-visible:outline-none" />
        }
        placeholder={
          <div className="text-muted-foreground text-center py-8">
            No content to preview. Start writing in the editor.
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
