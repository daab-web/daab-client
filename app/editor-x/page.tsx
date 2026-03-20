"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/editor-x/editor";

export default function EditorPage() {
  const [editorState, setEditorState] = useState<SerializedEditorState>();
  return (
    <div className="rounded-lg border shadow w-225 h-185">
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
      />
    </div>
  );
}
