"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="m-md-code-block" data-mono="codeblock">
      <div className="m-md-code-header">
        <span className="m-md-code-lang">{language || "text"}</span>
        <button
          type="button"
          className={`m-md-code-copy ${copied ? "m-md-code-copy--copied" : ""}`}
          onClick={handleCopy}
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="m-md-code-content">
        <code>{code}</code>
      </pre>
    </div>
  );
}
