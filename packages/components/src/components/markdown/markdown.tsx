"use client";

import { useMemo, type ReactNode } from "react";
import "./markdown.css";
import { CodeBlock } from "./markdown-code-block";
import { Callout, type CalloutType } from "./markdown-callout";
import { renderInline } from "./markdown-inline";
import { MarkdownTable } from "./markdown-table";
import { MarkdownHeading } from "./markdown-heading";
import { MarkdownMath } from "./markdown-math";
import { MarkdownChart } from "./markdown-chart";
import { MarkdownMermaid } from "./markdown-mermaid";

export type { CalloutType };

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  onWikilinkClick?: (link: string, alias?: string) => void;
  onTagClick?: (tag: string) => void;
  onTaskToggle?: (taskText: string, checked: boolean) => void;
}

export function MarkdownRenderer({
  content,
  className = "",
  onWikilinkClick,
  onTagClick,
  onTaskToggle,
}: MarkdownRendererProps) {
  const inlineOptions = useMemo(
    () => ({ onWikilinkClick, onTagClick }),
    [onWikilinkClick, onTagClick]
  );
  const inline = (text: string, keyPrefix = "") =>
    renderInline(text, keyPrefix, inlineOptions);

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
        const joinedCode = codeLines.join("\n");
        const normalizedLang = lang.trim().toLowerCase();
        if (normalizedLang === "chart") {
          blocks.push(
            <MarkdownChart key={`block-${blockIndex++}`} code={joinedCode} />
          );
        } else if (normalizedLang === "mermaid") {
          blocks.push(
            <MarkdownMermaid key={`block-${blockIndex++}`} code={joinedCode} />
          );
        } else {
          blocks.push(
            <CodeBlock
              key={`block-${blockIndex++}`}
              code={joinedCode}
              language={lang}
            />
          );
        }
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

      // 2b. Display Math Blocks: $$...$$ or \[...\]
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("$$") || trimmedLine.startsWith("\\[")) {
        const isBracket = trimmedLine.startsWith("\\[");
        const openDelim = isBracket ? "\\[" : "$$";
        const closeDelim = isBracket ? "\\]" : "$$";
        const afterOpen = trimmedLine.slice(openDelim.length);

        // Single-line display math: $$...$$ or \[...\]
        if (afterOpen.endsWith(closeDelim) && afterOpen.length > closeDelim.length) {
          const formula = afterOpen.slice(0, -closeDelim.length);
          blocks.push(
            <MarkdownMath key={`block-${blockIndex++}`} formula={formula} displayMode />
          );
          i++;
          continue;
        }

        // Multi-line display math
        if (afterOpen === "") {
          const mathLines: string[] = [];
          let j = i + 1;
          let closed = false;
          while (j < rawLines.length) {
            if (rawLines[j].trim() === closeDelim) {
              closed = true;
              break;
            }
            mathLines.push(rawLines[j]);
            j++;
          }
          if (closed) {
            blocks.push(
              <MarkdownMath
                key={`block-${blockIndex++}`}
                formula={mathLines.join("\n")}
                displayMode
              />
            );
            i = j + 1;
            continue;
          }
        }
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
        const level = headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
        const text = headerMatch[2];
        const key = `block-${blockIndex++}`;
        const inlineContent = inline(text, `h-${blockIndex}`);

        blocks.push(
          <MarkdownHeading key={key} level={level} rawText={text}>
            {inlineContent}
          </MarkdownHeading>
        );

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
      if (line.trim().startsWith("|")) {
        let nextI = i;
        const tableLines: string[] = [];
        while (nextI < rawLines.length && rawLines[nextI].trim().startsWith("|")) {
          tableLines.push(rawLines[nextI].trim());
          nextI++;
        }

        if (tableLines.length >= 2 && /^[|:\s-]+$/.test(tableLines[1])) {
          i = nextI;
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
            <MarkdownTable
              key={`block-${blockIndex++}`}
              headers={headerCells}
              rows={bodyRows}
              renderCell={(cellText, keyPrefix) => inline(cellText, keyPrefix)}
            />
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
                  {inline(it.text, `li-${idx}`)}
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
              <li key={`ol-${idx}`}>{inline(text, `ol-${idx}`)}</li>
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
            <span className="m-md-footnote-body">{inline(fnText, `fndef-${fnId}`)}</span>
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
        !/^(\*{3,}|-{3,}|_{3,})$/.test(rawLines[i].trim())
      ) {
        if (rawLines[i].trim().startsWith("|")) {
          if (i + 1 < rawLines.length && /^[|:\s-]+$/.test(rawLines[i + 1].trim())) {
            break;
          }
        }
        pLines.push(rawLines[i]);
        i++;
      }

      if (pLines.length === 0 && i < rawLines.length) {
        pLines.push(rawLines[i]);
        i++;
      }

      if (pLines.length > 0) {
        blocks.push(
          <p key={`block-${blockIndex++}`} className="m-md-p">
            {inline(pLines.join(" "), `p-${blockIndex}`)}
          </p>
        );
      }
    }

    return blocks;
  }, [content, onWikilinkClick, onTagClick, onTaskToggle]);

  return (
    <div className={`m-markdown ${className}`} data-mono="markdown">
      {parsedBlocks}
    </div>
  );
}
