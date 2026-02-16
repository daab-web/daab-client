"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { $isImageNode } from "./image-node";

interface ImageComponentProps {
  src: string;
  altText: string;
  width: "inherit" | number;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
}

export default function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  nodeKey,
  resizable,
}: ImageComponentProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const [editor] = useLexicalComposerContext();

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === imageRef.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  const onResizeStart = (direction: "se" | "sw" | "ne" | "nw") => (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    if (!imageRef.current) return;

    setIsResizing(true);
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = imageRef.current.offsetWidth;
    const startHeight = imageRef.current.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!imageRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on resize direction
      if (direction === "se" || direction === "ne") {
        newWidth = startWidth + deltaX;
      } else if (direction === "sw" || direction === "nw") {
        newWidth = startWidth - deltaX;
      }

      // Maintain aspect ratio
      newHeight = newWidth / aspectRatio;

      // Apply constraints
      newWidth = Math.max(100, Math.min(newWidth, maxWidth));
      newHeight = newWidth / aspectRatio;

      // Update the image node
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setWidthAndHeight(newWidth, newHeight);
        }
      });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const isFocused = isSelected;

  return (
    <div
      className={`relative inline-block my-4 ${
        isFocused ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        maxWidth: `${maxWidth}px`,
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        style={{
          width: width === "inherit" ? "100%" : `${width}px`,
          height: height === "inherit" ? "auto" : `${height}px`,
          cursor: isResizing ? "nwse-resize" : "pointer",
        }}
        className="max-w-full h-auto rounded-lg"
        draggable={false}
      />

      {resizable && isFocused && !isResizing && (
        <>
          {/* Southeast resize handle */}
          <div
            onMouseDown={onResizeStart("se")}
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize border-2 border-white rounded-sm"
            style={{ transform: "translate(50%, 50%)" }}
          />
          
          {/* Southwest resize handle */}
          <div
            onMouseDown={onResizeStart("sw")}
            className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 cursor-nesw-resize border-2 border-white rounded-sm"
            style={{ transform: "translate(-50%, 50%)" }}
          />
          
          {/* Northeast resize handle */}
          <div
            onMouseDown={onResizeStart("ne")}
            className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-nesw-resize border-2 border-white rounded-sm"
            style={{ transform: "translate(50%, -50%)" }}
          />
          
          {/* Northwest resize handle */}
          <div
            onMouseDown={onResizeStart("nw")}
            className="absolute top-0 left-0 w-4 h-4 bg-blue-500 cursor-nwse-resize border-2 border-white rounded-sm"
            style={{ transform: "translate(-50%, -50%)" }}
          />
        </>
      )}
    </div>
  );
}
