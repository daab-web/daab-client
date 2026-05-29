"use client";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { cn } from "@/lib/utils";

import ToolbarPlugin from "./plugins/toolbar-plugin";
import ImagesPlugin from "./plugins/image-plugin";
import LinkPlugin from "./plugins/link-plugin";
import { ImageNode } from "./nodes/image-node";
import { defineExtension, SerializedEditorState } from "lexical";
import { useMemo } from "react";

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

interface NewsEditorProps {
  onContentChange?: (editorState: SerializedEditorState) => void;
  initialEditorState?: SerializedEditorState;
}

export default function NewsEditor({
  onContentChange,
  initialEditorState,
}: NewsEditorProps) {
  const app = useMemo(() =>
    defineExtension({
      dependencies: [],
      name: "Editor",
      namespace: "DaabEditor",
      theme: theme,
      $initialEditorState(editor) {
        if (initialEditorState) {
          editor.parseEditorState(initialEditorState)
        }
      },
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
      ]
    }),
    []
  );

  return (
    <LexicalExtensionComposer extension={app}>
      <div className="relative rounded-lg border bg-background">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "min-h-112.5 resize-none overflow-auto px-4 py-3 text-base",
                  "outline-none focus-visible:outline-none",
                )}
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-4 top-3 text-muted-foreground">
                Start writing your news article...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <LinkPlugin hasLinkAttributes />
          <ListPlugin />
          <ImagesPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState) => onContentChange?.(editorState.toJSON())}
      />
    </LexicalExtensionComposer>
  );
}
