"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { SerializedEditorState } from "lexical"

export function useEditorContent(onChange: (editorState: SerializedEditorState) => void) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const serializedState = editorState.toJSON()
      onChange(serializedState)
    })
  }, [editor, onChange])

  return null
}
