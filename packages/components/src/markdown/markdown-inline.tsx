"use client";

import type { ReactNode, MouseEvent } from "react";
import { ExternalLink, Hash } from "lucide-react";

interface RenderInlineOptions {
  onWikilinkClick?: (link: string, alias?: string) => void;
  onTagClick?: (tag: string) => void;
}

export function renderInline(
  text: string,
  keyPrefix = "",
  options: RenderInlineOptions = {}
): ReactNode[] {
  const { onWikilinkClick, onTagClick } = options;
  const nodes: ReactNode[] = [];
  let remaining = text;
  let nodeIndex = 0;

  while (remaining.length > 0) {
    // 1. Wikilinks: [[Target|Alias]] or [[Target]]
    const wikilinkMatch = remaining.match(/^\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/);
    if (wikilinkMatch) {
      const fullMatch = wikilinkMatch[0];
      const target = wikilinkMatch[1].trim();
      const alias = wikilinkMatch[2]?.trim() || target;
      nodes.push(
        <a
          key={`${keyPrefix}-wiki-${nodeIndex++}`}
          href={`#${encodeURIComponent(target)}`}
          className="m-md-wikilink"
          onClick={(e: MouseEvent) => {
            if (onWikilinkClick) {
              e.preventDefault();
              onWikilinkClick(target, alias);
            }
          }}
        >
          {alias}
        </a>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 2. Obsidian Tags: #tag/subtag
    const tagMatch = remaining.match(/^#([a-zA-Z0-9_\-/]+)/);
    if (tagMatch) {
      const fullMatch = tagMatch[0];
      const tag = tagMatch[1];
      nodes.push(
        <span
          key={`${keyPrefix}-tag-${nodeIndex++}`}
          className="m-md-tag"
          onClick={() => onTagClick?.(tag)}
          role={onTagClick ? "button" : undefined}
          tabIndex={onTagClick ? 0 : undefined}
        >
          <Hash size={11} className="m-md-tag-icon" aria-hidden="true" />
          <span>{tag}</span>
        </span>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 3. Obsidian Highlights: ==text==
    const highlightMatch = remaining.match(/^==([\s\S]+?)==/);
    if (highlightMatch) {
      const fullMatch = highlightMatch[0];
      const innerText = highlightMatch[1];
      nodes.push(
        <mark key={`${keyPrefix}-mark-${nodeIndex++}`} className="m-md-highlight">
          {renderInline(innerText, `${keyPrefix}-m`, options)}
        </mark>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 4. Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~([\s\S]+?)~~/);
    if (strikeMatch) {
      const fullMatch = strikeMatch[0];
      const innerText = strikeMatch[1];
      nodes.push(
        <del key={`${keyPrefix}-del-${nodeIndex++}`} className="m-md-strikethrough">
          {renderInline(innerText, `${keyPrefix}-s`, options)}
        </del>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 5. Bold & Italic: ***text***
    const boldItalicMatch = remaining.match(/^\*\*\*([\s\S]+?)\*\*\*/);
    if (boldItalicMatch) {
      const fullMatch = boldItalicMatch[0];
      nodes.push(
        <strong key={`${keyPrefix}-bi-${nodeIndex++}`}>
          <em>{renderInline(boldItalicMatch[1], `${keyPrefix}-bi`, options)}</em>
        </strong>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 6. Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)([\s\S]+?)\1/);
    if (boldMatch) {
      const fullMatch = boldMatch[0];
      nodes.push(
        <strong key={`${keyPrefix}-b-${nodeIndex++}`}>
          {renderInline(boldMatch[2], `${keyPrefix}-b`, options)}
        </strong>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 7. Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+?)\1/);
    if (italicMatch) {
      const fullMatch = italicMatch[0];
      nodes.push(
        <em key={`${keyPrefix}-i-${nodeIndex++}`}>
          {renderInline(italicMatch[2], `${keyPrefix}-i`, options)}
        </em>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 8. Inline Code: `code`
    const inlineCodeMatch = remaining.match(/^`([^`]+)`/);
    if (inlineCodeMatch) {
      const fullMatch = inlineCodeMatch[0];
      nodes.push(
        <code key={`${keyPrefix}-code-${nodeIndex++}`} className="m-md-inline-code">
          {inlineCodeMatch[1]}
        </code>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 9. Standard Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const fullMatch = linkMatch[0];
      const textLabel = linkMatch[1];
      const href = linkMatch[2];
      const isExternal = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={`${keyPrefix}-link-${nodeIndex++}`}
          href={href}
          className="m-md-link"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {renderInline(textLabel, `${keyPrefix}-l`, options)}
          {isExternal ? (
            <ExternalLink size={11} className="m-md-external-icon" aria-hidden="true" />
          ) : null}
        </a>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // 10. Footnote ref: [^1]
    const footnoteRefMatch = remaining.match(/^\[\^([a-zA-Z0-9_-]+)\]/);
    if (footnoteRefMatch) {
      const fullMatch = footnoteRefMatch[0];
      const fnId = footnoteRefMatch[1];
      nodes.push(
        <sup key={`${keyPrefix}-fn-${nodeIndex++}`} className="m-md-footnote-ref">
          <a href={`#fn-${fnId}`} id={`fnref-${fnId}`}>
            [{fnId}]
          </a>
        </sup>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // Regular text character(s)
    const nextSpecial = remaining.search(/(\[\[|#[a-zA-Z0-9_\-/]|==|~~|\*\*\*|\*\*|__|\*|_|`|\[[^\]]+\]\(|\[\^)/);
    if (nextSpecial === -1) {
      nodes.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      nodes.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      nodes.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return nodes;
}
