import { SerializedEditorState } from "lexical";

function createTextNode(text: string) {
  return {
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    text,
    type: "text",
    version: 1,
  };
}

function createParagraphNode(text: string) {
  return {
    children: text ? [createTextNode(text)] : [],
    direction: null,
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  };
}

export function isSerializedEditorState(
  value: unknown,
): value is SerializedEditorState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeState = value as { root?: { children?: unknown } };
  return Array.isArray(maybeState.root?.children);
}

export function toEditorStateFromPlainText(
  text: string,
): SerializedEditorState {
  const lines = text.split(/\r?\n/);
  const children = lines.map((line) => createParagraphNode(line));

  return {
    root: {
      children,
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

export function parseScientistDescription(
  description?: string | null,
): SerializedEditorState | null {
  if (!description?.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(description);
    if (isSerializedEditorState(parsed)) {
      return parsed;
    }
  } catch {
    return toEditorStateFromPlainText(description);
  }

  return toEditorStateFromPlainText(description);
}

export function serializeScientistDescription(
  editorState: SerializedEditorState | null,
): string {
  if (!editorState) {
    return "";
  }

  return JSON.stringify(editorState);
}

type LexicalLikeNode = {
  type?: string;
  text?: string;
  children?: LexicalLikeNode[];
};

function collectText(node: LexicalLikeNode): string {
  const ownText =
    node.type === "text" && typeof node.text === "string" ? node.text : "";
  const childrenText = Array.isArray(node.children)
    ? node.children.map(collectText).join("")
    : "";

  if (["paragraph", "quote", "listitem", "heading"].includes(node.type ?? "")) {
    return `${ownText}${childrenText}\n`;
  }

  return `${ownText}${childrenText}`;
}

export function getScientistDescriptionPreview(
  description?: string | null,
  maxLength: number = 280,
): string {
  if (!description?.trim()) {
    return "";
  }

  let plainText = description;

  try {
    const parsed = JSON.parse(description);
    if (isSerializedEditorState(parsed)) {
      plainText = collectText(parsed.root as LexicalLikeNode)
        .replace(/\s+/g, " ")
        .trim();
    }
  } catch {
    plainText = description.replace(/\s+/g, " ").trim();
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}
