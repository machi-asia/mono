"use client";

import {
  useState,
  useMemo,
  type ReactNode,
  type MouseEvent,
} from "react";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  Flame,
  Quote as QuoteIcon,
  CheckCircle2,
  ListTodo,
  FileCode,
  Bug,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Hash,
} from "lucide-react";
import "./markdown.css";

export type CalloutType =
  | "note"
  | "tip"
  | "info"
  | "warning"
  | "caution"
  | "danger"
  | "error"
  | "quote"
  | "todo"
  | "example"
  | "bug"
  | "success"
  | "abstract"
  | "summary"
  | "tldr"
  | "faq"
  | "help"
  | "question";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  onWikilinkClick?: (link: string, alias?: string) => void;
  onTagClick?: (tag: string) => void;
  onTaskToggle?: (taskText: string, checked: boolean) => void;
}

interface CalloutConfig {
  type: CalloutType;
  title: string;
  icon: typeof Info;
  className: string;
}

const CALLOUT_CONFIGS: Record<string, CalloutConfig> = {
  note: { type: "note", title: "Note", icon: Info, className: "m-callout--note" },
  info: { type: "info", title: "Info", icon: Info, className: "m-callout--info" },
  tip: { type: "tip", title: "Tip", icon: Lightbulb, className: "m-callout--tip" },
  hint: { type: "tip", title: "Hint", icon: Lightbulb, className: "m-callout--tip" },
  important: { type: "info", title: "Important", icon: Sparkles, className: "m-callout--info" },
  warning: { type: "warning", title: "Warning", icon: AlertTriangle, className: "m-callout--warning" },
  caution: { type: "caution", title: "Caution", icon: AlertTriangle, className: "m-callout--caution" },
  attention: { type: "warning", title: "Attention", icon: AlertTriangle, className: "m-callout--warning" },
  danger: { type: "danger", title: "Danger", icon: Flame, className: "m-callout--danger" },
  error: { type: "danger", title: "Error", icon: AlertOctagon, className: "m-callout--danger" },
  bug: { type: "bug", title: "Bug", icon: Bug, className: "m-callout--bug" },
  example: { type: "example", title: "Example", icon: FileCode, className: "m-callout--example" },
  quote: { type: "quote", title: "Quote", icon: QuoteIcon, className: "m-callout--quote" },
  cite: { type: "quote", title: "Cite", icon: QuoteIcon, className: "m-callout--quote" },
  todo: { type: "todo", title: "To Do", icon: ListTodo, className: "m-callout--todo" },
  success: { type: "success", title: "Success", icon: CheckCircle2, className: "m-callout--success" },
  check: { type: "success", title: "Check", icon: CheckCircle2, className: "m-callout--success" },
  done: { type: "success", title: "Done", icon: CheckCircle2, className: "m-callout--success" },
  abstract: { type: "abstract", title: "Abstract", icon: Sparkles, className: "m-callout--abstract" },
  summary: { type: "summary", title: "Summary", icon: Sparkles, className: "m-callout--abstract" },
  tldr: { type: "tldr", title: "TL;DR", icon: Sparkles, className: "m-callout--abstract" },
  question: { type: "question", title: "Question", icon: HelpCircle, className: "m-callout--question" },
  help: { type: "help", title: "Help", icon: HelpCircle, className: "m-callout--question" },
  faq: { type: "faq", title: "FAQ", icon: HelpCircle, className: "m-callout--question" },
};

function CodeBlock({ code, language }: { code: string; language: string }) {
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

function Callout({
  typeKey,
  foldable,
  defaultClosed,
  customTitle,
  children,
}: {
  typeKey: string;
  foldable: boolean;
  defaultClosed: boolean;
  customTitle?: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(foldable && defaultClosed);
  const normKey = typeKey.toLowerCase();
  const config = CALLOUT_CONFIGS[normKey] || CALLOUT_CONFIGS.note;
  const IconComponent = config.icon;
  const title = customTitle || config.title;

  return (
    <div
      className={`m-callout ${config.className} ${foldable ? "m-callout--foldable" : ""} ${
        collapsed ? "m-callout--collapsed" : ""
      }`}
      data-callout={config.type}
    >
      <div
        className="m-callout-header"
        onClick={foldable ? () => setCollapsed(!collapsed) : undefined}
        role={foldable ? "button" : undefined}
        tabIndex={foldable ? 0 : undefined}
        onKeyDown={
          foldable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCollapsed(!collapsed);
                }
              }
            : undefined
        }
      >
        <div className="m-callout-icon" aria-hidden="true">
          <IconComponent size={18} />
        </div>
        <div className="m-callout-title">{title}</div>
        {foldable ? (
          <div className="m-callout-fold" aria-hidden="true">
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </div>
        ) : null}
      </div>
      {!collapsed ? <div className="m-callout-content">{children}</div> : null}
    </div>
  );
}

export function MarkdownRenderer({
  content,
  className = "",
  onWikilinkClick,
  onTagClick,
  onTaskToggle,
}: MarkdownRendererProps) {
  function renderInline(text: string, keyPrefix = ""): ReactNode[] {
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
            {renderInline(innerText, `${keyPrefix}-m`)}
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
            {renderInline(innerText, `${keyPrefix}-s`)}
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
            <em>{renderInline(boldItalicMatch[1], `${keyPrefix}-bi`)}</em>
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
            {renderInline(boldMatch[2], `${keyPrefix}-b`)}
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
            {renderInline(italicMatch[2], `${keyPrefix}-i`)}
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
            {renderInline(textLabel, `${keyPrefix}-l`)}
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

  const parsedBlocks = useMemo(() => {
    const rawLines = content.replace(/\r\n/g, "\n").split("\n");
    const blocks: ReactNode[] = [];
    let i = 0;
    let blockIndex = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];

      // Empty line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // 1. Fenced Code Block: ```language
      if (line.trimStart().startsWith("```")) {
        const lang = line.trimStart().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].trimStart().startsWith("```")) {
          codeLines.push(rawLines[i]);
          i++;
        }
        if (i < rawLines.length) i++; // skip closing ```
        blocks.push(
          <CodeBlock
            key={`block-${blockIndex++}`}
            code={codeLines.join("\n")}
            language={lang}
          />
        );
        continue;
      }

      // 2. Obsidian Callouts: > [!type]+ Title or > [!type]
      if (/^>\s*\[!([a-zA-Z_-]+)\]([+-]?)(.*)$/.test(line)) {
        const calloutHeaderMatch = line.match(/^>\s*\[!([a-zA-Z_-]+)\]([+-]?)(.*)$/);
        const typeKey = calloutHeaderMatch ? calloutHeaderMatch[1] : "note";
        const foldSign = calloutHeaderMatch ? calloutHeaderMatch[2] : "";
        const customTitle = calloutHeaderMatch ? calloutHeaderMatch[3].trim() : "";
        const foldable = foldSign === "+" || foldSign === "-";
        const defaultClosed = foldSign === "-";

        const calloutLines: string[] = [];
        i++;
        while (i < rawLines.length) {
          const cLine = rawLines[i];
          if (cLine.startsWith(">")) {
            calloutLines.push(cLine.replace(/^>\s?/, ""));
            i++;
          } else if (cLine.trim() === "") {
            // Check if next line continues the quote
            if (i + 1 < rawLines.length && rawLines[i + 1].startsWith(">")) {
              calloutLines.push("");
              i++;
            } else {
              break;
            }
          } else {
            break;
          }
        }

        blocks.push(
          <Callout
            key={`block-${blockIndex++}`}
            typeKey={typeKey}
            foldable={foldable}
            defaultClosed={defaultClosed}
            customTitle={customTitle || undefined}
          >
            <MarkdownRenderer
              content={calloutLines.join("\n")}
              onWikilinkClick={onWikilinkClick}
              onTagClick={onTagClick}
              onTaskToggle={onTaskToggle}
            />
          </Callout>
        );
        continue;
      }

      // 3. Regular Blockquote: > text
      if (line.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < rawLines.length && (rawLines[i].startsWith(">") || rawLines[i].trim() === "")) {
          if (rawLines[i].trim() === "" && (i + 1 >= rawLines.length || !rawLines[i + 1].startsWith(">"))) {
            break;
          }
          quoteLines.push(rawLines[i].replace(/^>\s?/, ""));
          i++;
        }
        blocks.push(
          <blockquote key={`block-${blockIndex++}`} className="m-md-blockquote">
            <MarkdownRenderer
              content={quoteLines.join("\n")}
              onWikilinkClick={onWikilinkClick}
              onTagClick={onTagClick}
              onTaskToggle={onTaskToggle}
            />
          </blockquote>
        );
        continue;
      }

      // 4. Headers: #, ##, ###, ####, #####, ######
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        const key = `block-${blockIndex++}`;
        const inlineContent = renderInline(text, `h-${blockIndex}`);
        const cls = `m-md-heading m-md-h${level}`;

        if (level === 1) blocks.push(<h1 key={key} className={cls}>{inlineContent}</h1>);
        else if (level === 2) blocks.push(<h2 key={key} className={cls}>{inlineContent}</h2>);
        else if (level === 3) blocks.push(<h3 key={key} className={cls}>{inlineContent}</h3>);
        else if (level === 4) blocks.push(<h4 key={key} className={cls}>{inlineContent}</h4>);
        else if (level === 5) blocks.push(<h5 key={key} className={cls}>{inlineContent}</h5>);
        else blocks.push(<h6 key={key} className={cls}>{inlineContent}</h6>);

        i++;
        continue;
      }

      // 5. Horizontal Rule: ---, ***, ___
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
        blocks.push(<hr key={`block-${blockIndex++}`} className="m-md-hr" />);
        i++;
        continue;
      }

      // 6. GFM Tables: | col1 | col2 |
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        if (tableLines.length >= 2 && /^[|:\s-]+$/.test(tableLines[1])) {
          const headerCells = tableLines[0]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          const bodyRows = tableLines.slice(2).map((row) =>
            row
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );

          blocks.push(
            <div key={`block-${blockIndex++}`} className="m-md-table-wrap">
              <table className="m-md-table">
                <thead>
                  <tr>
                    {headerCells.map((cell, idx) => (
                      <th key={`th-${idx}`}>{renderInline(cell, `th-${idx}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((rowCells, rIdx) => (
                    <tr key={`tr-${rIdx}`}>
                      {rowCells.map((cell, cIdx) => (
                        <td key={`td-${rIdx}-${cIdx}`}>{renderInline(cell, `td-${rIdx}-${cIdx}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 7. Task Lists & Bullet Lists: - [ ] or - [x] or - / *
      if (/^[-*+]\s+/.test(line.trimStart())) {
        const listItems: { isTask: boolean; checked?: boolean; text: string }[] = [];
        while (i < rawLines.length && /^[-*+]\s+/.test(rawLines[i].trimStart())) {
          const itemLine = rawLines[i].trimStart().replace(/^[-*+]\s+/, "");
          const taskMatch = itemLine.match(/^\[([ xX])\]\s+(.+)$/);
          if (taskMatch) {
            const checked = taskMatch[1].toLowerCase() === "x";
            listItems.push({ isTask: true, checked, text: taskMatch[2] });
          } else {
            listItems.push({ isTask: false, text: itemLine });
          }
          i++;
        }

        const hasTasks = listItems.some((it) => it.isTask);
        blocks.push(
          <ul
            key={`block-${blockIndex++}`}
            className={`m-md-list ${hasTasks ? "m-md-task-list" : ""}`}
          >
            {listItems.map((it, idx) => (
              <li
                key={`li-${idx}`}
                className={`m-md-list-item ${it.isTask ? "m-md-task-item" : ""} ${
                  it.checked ? "m-md-task-item--checked" : ""
                }`}
              >
                {it.isTask ? (
                  <input
                    type="checkbox"
                    className="m-md-task-checkbox"
                    checked={it.checked}
                    onChange={(e) => onTaskToggle?.(it.text, e.target.checked)}
                    aria-label={it.text}
                  />
                ) : null}
                <span className="m-md-item-content">
                  {renderInline(it.text, `li-${idx}`)}
                </span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // 8. Numbered Lists: 1. item
      if (/^\d+\.\s+/.test(line.trimStart())) {
        const numItems: string[] = [];
        while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trimStart())) {
          const itemText = rawLines[i].trimStart().replace(/^\d+\.\s+/, "");
          numItems.push(itemText);
          i++;
        }
        blocks.push(
          <ol key={`block-${blockIndex++}`} className="m-md-ordered-list">
            {numItems.map((text, idx) => (
              <li key={`ol-${idx}`}>{renderInline(text, `ol-${idx}`)}</li>
            ))}
          </ol>
        );
        continue;
      }

      // 9. Footnote definition: [^1]: Text
      const footnoteDefMatch = line.match(/^\[\^([a-zA-Z0-9_-]+)\]:\s+(.+)$/);
      if (footnoteDefMatch) {
        const fnId = footnoteDefMatch[1];
        const fnText = footnoteDefMatch[2];
        blocks.push(
          <div
            key={`block-${blockIndex++}`}
            id={`fn-${fnId}`}
            className="m-md-footnote-def"
          >
            <span className="m-md-footnote-id">[{fnId}]</span>
            <span className="m-md-footnote-body">{renderInline(fnText, `fndef-${fnId}`)}</span>
            <a href={`#fnref-${fnId}`} className="m-md-footnote-back" aria-label="Back to reference">
              ↩
            </a>
          </div>
        );
        i++;
        continue;
      }

      // 10. Standard Paragraph
      const pLines: string[] = [];
      while (
        i < rawLines.length &&
        rawLines[i].trim() !== "" &&
        !rawLines[i].trimStart().startsWith("```") &&
        !rawLines[i].startsWith(">") &&
        !/^(#{1,6})\s+/.test(rawLines[i]) &&
        !/^[-*+]\s+/.test(rawLines[i].trimStart()) &&
        !/^\d+\.\s+/.test(rawLines[i].trimStart()) &&
        !/^(\*{3,}|-{3,}|_{3,})$/.test(rawLines[i].trim()) &&
        !rawLines[i].trim().startsWith("|")
      ) {
        pLines.push(rawLines[i]);
        i++;
      }

      blocks.push(
        <p key={`block-${blockIndex++}`} className="m-md-p">
          {renderInline(pLines.join(" "), `p-${blockIndex}`)}
        </p>
      );
    }

    return blocks;
  }, [content, onWikilinkClick, onTagClick, onTaskToggle]);

  return (
    <div className={`m-markdown ${className}`} data-mono="markdown">
      {parsedBlocks}
    </div>
  );
}
