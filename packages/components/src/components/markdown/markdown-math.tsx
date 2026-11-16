"use client";

import { useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Check, Copy } from "lucide-react";

export interface MarkdownMathProps {
  formula: string;
  displayMode?: boolean;
}

/**
 * Renders inline or block LaTeX mathematical formulas using KaTeX.
 */
export function MarkdownMath({ formula, displayMode = false }: MarkdownMathProps) {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [formula, displayMode]);

  if (!html) {
    return (
      <code className="m-md-inline-code">
        {displayMode ? `$$${formula}$$` : `$${formula}$`}
      </code>
    );
  }

  if (!displayMode) {
    return (
      <span
        className="m-md-math-inline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(formula.trim()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="m-md-math-block">
      <button
        type="button"
        className="m-md-math-copy"
        onClick={handleCopy}
        title="Copy LaTeX"
        aria-label="Copy LaTeX formula"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <div
        className="m-md-math-display"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
