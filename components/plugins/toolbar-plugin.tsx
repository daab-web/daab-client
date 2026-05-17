"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSERT_IMAGE_COMMAND } from "./image-plugin";
import { validateUrl } from "./link-plugin";

const LowPriority = 1;

type ToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isLink: boolean;
  blockType: string;
};

const INITIAL_TOOLBAR_STATE: ToolbarState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  isLink: false,
  blockType: "paragraph",
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState<ToolbarState>(
    INITIAL_TOOLBAR_STATE,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (src) {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: file.name,
          src,
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const focusNode = selection.focus.getNode();
      const anchorParent = anchorNode.getParent();
      const focusParent = focusNode.getParent();
      const isLink =
        $isLinkNode(anchorNode) ||
        $isLinkNode(focusNode) ||
        $isLinkNode(anchorParent) ||
        $isLinkNode(focusParent);

      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      const blockType = $isListNode(element)
        ? ($getNearestNodeOfType(anchorNode, ListNode)?.getListType() ??
          element.getListType())
        : element.getType();

      setToolbarState((prev) => {
        const next: ToolbarState = {
          isBold: selection.hasFormat("bold"),
          isItalic: selection.hasFormat("italic"),
          isUnderline: selection.hasFormat("underline"),
          isStrikethrough: selection.hasFormat("strikethrough"),
          isCode: selection.hasFormat("code"),
          isLink,
          blockType,
        };

        if (
          prev.isBold === next.isBold &&
          prev.isItalic === next.isItalic &&
          prev.isUnderline === next.isUnderline &&
          prev.isStrikethrough === next.isStrikethrough &&
          prev.isCode === next.isCode &&
          prev.isLink === next.isLink &&
          prev.blockType === next.blockType
        ) {
          return prev;
        }

        return next;
      });
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
    );
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: HeadingTagType) => {
    if (toolbarState.blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatQuote = () => {
    if (toolbarState.blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatBulletList = () => {
    if (toolbarState.blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (toolbarState.blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const toggleLink = () => {
    if (toolbarState.isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }

    const url = window.prompt("Enter URL", "https://");
    if (!url) return;

    const normalizedUrl = url.trim();
    if (!validateUrl(normalizedUrl)) {
      window.alert(
        "Please enter a valid URL with supported protocol (http, https, mailto, sms, tel).",
      );
      return;
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, normalizedUrl);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-2">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="h-8 w-8"
        title="Undo"
        aria-label="Undo"
        type="button"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="h-8 w-8"
        title="Redo"
        aria-label="Redo"
        type="button"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Block Type */}
      <Select
        value={toolbarState.blockType}
        onValueChange={(value) => {
          if (value === "h1") formatHeading("h1");
          else if (value === "h2") formatHeading("h2");
          else if (value === "h3") formatHeading("h3");
          else if (value === "quote") formatQuote();
        }}
      >
        <SelectTrigger
          className="h-8 w-32.5"
          title="Block type"
          aria-label="Block type"
        >
          <SelectValue placeholder="Normal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="quote">Quote</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Text Formatting */}
      <Button
        variant={toolbarState.isBold ? "secondary" : "ghost"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="h-8 w-8"
        type="button"
        title="Bold"
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={toolbarState.isItalic ? "secondary" : "ghost"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="h-8 w-8"
        type="button"
        title="Italic"
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={toolbarState.isUnderline ? "secondary" : "ghost"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="h-8 w-8"
        type="button"
        title="Underline"
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={toolbarState.isStrikethrough ? "secondary" : "ghost"}
        size="icon"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className="h-8 w-8"
        type="button"
        title="Strikethrough"
        aria-label="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={toolbarState.isCode ? "secondary" : "ghost"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        className="h-8 w-8"
        type="button"
        title="Code"
        aria-label="Code"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant={toolbarState.isLink ? "secondary" : "ghost"}
        size="icon"
        onClick={toggleLink}
        className="h-8 w-8"
        type="button"
        title="Insert link"
        aria-label="Insert link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Lists */}
      <Button
        variant={toolbarState.blockType === "bullet" ? "secondary" : "ghost"}
        size="icon"
        onClick={formatBulletList}
        className="h-8 w-8"
        type="button"
        title="Bulleted list"
        aria-label="Bulleted list"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={toolbarState.blockType === "number" ? "secondary" : "ghost"}
        size="icon"
        onClick={formatNumberedList}
        className="h-8 w-8"
        type="button"
        title="Numbered list"
        aria-label="Numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Image */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 w-8"
        type="button"
        title="Insert image"
        aria-label="Insert image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="h-8 w-8"
        type="button"
        title="Align left"
        aria-label="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="h-8 w-8"
        type="button"
        title="Align center"
        aria-label="Align center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="h-8 w-8"
        type="button"
        title="Align right"
        aria-label="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        className="h-8 w-8"
        type="button"
        title="Justify"
        aria-label="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
}
