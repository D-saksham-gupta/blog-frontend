"use client";

import { useEffect, useState } from "react";

// Lexical core + React
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// Lexical core APIs
import {
  $getRoot,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  ParagraphNode,
  TextNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";

// List
import {
  ListItemNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

// Rich text
import { HeadingNode, QuoteNode, $createHeadingNode } from "@lexical/rich-text";

// Links
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

// Selection helpers
import { $setBlocksType } from "@lexical/selection";

// HTML <-> Lexical
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

/* --------------------------- HTML → Lexical plugin --------------------------- */
/** Loads initial HTML into the editor exactly once (no controlled-loop). */
function HtmlContentPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!initialHtml || isInitialized) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, "text/html");

      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();

      root.clear();

      // Wrap generated nodes in a paragraph to avoid root insertion errors
      const paragraph = $createParagraphNode();
      nodes.forEach((node) => paragraph.append(node));
      root.append(paragraph);
    });

    setIsInitialized(true);
  }, [editor, initialHtml, isInitialized]);

  return null;
}

/* --------------------------- Lexical → HTML plugin --------------------------- */
function HtmlOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onChange(html);
        });
      }}
    />
  );
}

/* ------------------------------- Toolbar plugin ------------------------------ */
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const applyList = (type) => {
    if (type === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (type === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const applyHeading = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (tag === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const applyAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL (leave empty to remove link):");
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
    }
  };

  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  const buttonBase =
    "px-2 py-1 text-xs sm:text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 transition";
  const selectBase =
    "px-2 py-1 text-xs sm:text-sm rounded-md border border-gray-200 bg-white";

  return (
    <div className="flex flex-wrap gap-2 px-3 py-2 border-b bg-gray-50">
      {/* Headings dropdown */}
      <select
        className={selectBase}
        defaultValue="paragraph"
        onChange={(e) => applyHeading(e.target.value)}
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">H1 Heading</option>
        <option value="h2">H2 Heading</option>
        <option value="h3">H3 Heading</option>
      </select>

      {/* Inline styles */}
      <button
        type="button"
        className={buttonBase + " font-semibold"}
        onClick={() => applyFormat("bold")}
      >
        B
      </button>
      <button
        type="button"
        className={buttonBase + " italic"}
        onClick={() => applyFormat("italic")}
      >
        I
      </button>
      <button
        type="button"
        className={buttonBase + " underline"}
        onClick={() => applyFormat("underline")}
      >
        U
      </button>
      <button
        type="button"
        className={buttonBase + " line-through"}
        onClick={() => applyFormat("strikethrough")}
      >
        S
      </button>

      {/* Lists */}
      <button
        type="button"
        className={buttonBase}
        onClick={() => applyList("ul")}
      >
        • List
      </button>
      <button
        type="button"
        className={buttonBase}
        onClick={() => applyList("ol")}
      >
        1. List
      </button>

      {/* Text alignment */}
      <button
        type="button"
        className={buttonBase}
        onClick={() => applyAlignment("left")}
      >
        ⬅ Left
      </button>
      <button
        type="button"
        className={buttonBase}
        onClick={() => applyAlignment("center")}
      >
        ⬌ Center
      </button>
      <button
        type="button"
        className={buttonBase}
        onClick={() => applyAlignment("right")}
      >
        Right ➡
      </button>
      <button
        type="button"
        className={buttonBase}
        onClick={() => applyAlignment("justify")}
      >
        ☰ Justify
      </button>

      {/* Link */}
      <button type="button" className={buttonBase} onClick={insertLink}>
        🔗 Link
      </button>

      {/* History */}
      <button type="button" className={buttonBase} onClick={undo}>
        ↺ Undo
      </button>
      <button type="button" className={buttonBase} onClick={redo}>
        ↻ Redo
      </button>
    </div>
  );
}

/* ---------------------------- Main editor wrapper ---------------------------- */

export default function RichTextEditor({ value, onChange, placeholder }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // avoid SSR / DOMParser issues
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[450px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-300 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  const initialConfig = {
    namespace: "LexicalRichTextEditor",
    theme: {
      paragraph: "mb-2",
      heading: {
        h1: "text-3xl font-bold mb-4",
        h2: "text-2xl font-semibold mb-3",
        h3: "text-xl font-semibold mb-2",
      },
      text: {
        bold: "font-semibold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
      },
      list: {
        ul: "list-disc ml-6",
        ol: "list-decimal ml-6",
        listitem: "mb-1",
      },
      link: "text-blue-600 underline",
    },
    nodes: [
      ParagraphNode,
      TextNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
    ],
    onError(error) {
      console.error("Lexical error:", error);
    },
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex flex-col">
          <ToolbarPlugin />
          <div className="px-4 py-3 min-h-[400px] bg-white">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="outline-none min-h-[350px] text-base leading-relaxed" />
              }
              placeholder={
                <div className="pointer-events-none text-gray-400">
                  {placeholder || "Write your content here..."}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />

            {/* HTML <-> Lexical bridge */}
            <HtmlContentPlugin initialHtml={value} />
            <HtmlOnChangePlugin onChange={onChange} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
