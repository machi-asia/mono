"use client";

import { useRef, useCallback } from "react";
import "./texteditor.css";

export interface TextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS = [
  { command: "bold", label: "B", title: "Bold" },
  { command: "italic", label: "I", title: "Italic" },
  { command: "underline", label: "U", title: "Underline" },
  { command: "insertUnorderedList", label: "•", title: "Bullet list" },
  { command: "insertOrderedList", label: "1.", title: "Numbered list" },
] as const;

export function TextEditor({ value = "", onChange, placeholder = "Start typing...", minHeight = "120px" }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback(
    (command: string) => {
      document.execCommand(command);
      editorRef.current?.focus();
      onChange?.(editorRef.current?.innerHTML ?? "");
    },
    [onChange]
  );

  return (
    <div className="m-texteditor" data-mono="texteditor">
      <div className="m-texteditor-toolbar" role="toolbar" aria-label="Formatting">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.command}
            type="button"
            className="m-texteditor-btn"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand(btn.command);
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="m-texteditor-content"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => {
          onChange?.(editorRef.current?.innerHTML ?? "");
        }}
      />
    </div>
  );
}
