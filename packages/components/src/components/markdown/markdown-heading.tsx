"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

export interface MarkdownHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  rawText: string;
  children: ReactNode;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`~[\]()!]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function MarkdownHeading({ level, rawText, children }: MarkdownHeadingProps) {
  const [copied, setCopied] = useState(false);
  const slug = slugifyHeading(rawText);
  const Tag = `h${level}` as const;

  const handleCopyAnchor = async () => {
    if (!slug) return;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = `#${slug}`;
      window.history.replaceState(null, "", url.toString());
      const el = document.getElementById(slug);
      el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      try {
        await navigator.clipboard.writeText(url.toString());
      } catch {
        // Ignore clipboard permission errors in restricted contexts
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Tag id={slug || undefined} className={`m-md-heading m-md-h${level}`}>
      <span className="m-md-heading-text">{children}</span>
      {slug ? (
        <button
          type="button"
          className={`m-md-heading-anchor ${copied ? "is-copied" : ""}`}
          onClick={handleCopyAnchor}
          aria-label={`Copy link to ${rawText}`}
          title={copied ? "Link copied" : "Copy section link"}
        >
          {copied ? <Check size={14} /> : <LinkIcon size={14} />}
        </button>
      ) : null}
    </Tag>
  );
}
