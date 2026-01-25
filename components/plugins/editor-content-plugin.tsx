"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $generateHtmlFromNodes } from "@lexical/html"
import { useEffect } from "react"

export function useEditorContent(onChange: (html: string) => void) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor)
        onChange(htmlString)
      })
    })
  }, [editor, onChange])

  return null
}

export function getEditorHtml(editor: any): string {
  let htmlString = ""
  editor.getEditorState().read(() => {
    htmlString = $generateHtmlFromNodes(editor)
  })
  return htmlString
}
