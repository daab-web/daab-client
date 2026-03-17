"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { SerializedEditorState } from "lexical";

interface UseEditorContentOptions {
  debounceMs?: number;
}

export function useEditorContent(
  onChange: (editorState: SerializedEditorState) => void,
  { debounceMs = 150 }: UseEditorContentOptions = {},
) {
  const [editor] = useLexicalComposerContext();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          onChangeRef.current(editorState.toJSON());
        }, debounceMs);
      },
    );

    return () => {
      unregister();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [debounceMs, editor]);

  return null;
}
