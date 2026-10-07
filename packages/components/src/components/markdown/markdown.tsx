"use client";

import { useMemo, type ReactNode } from "react";
import "./markdown.css";
import { CodeBlock } from "./markdown-code-block";
import { Callout, type CalloutType } from "./markdown-callout";
import { renderInline } from "./markdown-inline";

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
        const inlineContent = inline(text, `h-${blockIndex}`);
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
                      <th key={`th-${idx}`}>{inline(cell, `th-${idx}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((rowCells, rIdx) => (
                    <tr key={`tr-${rIdx}`}>
                      {rowCells.map((cell, cIdx) => (
                        <td key={`td-${rIdx}-${cIdx}`}>{inline(cell, `td-${rIdx}-${cIdx}`)}</td>
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
        !/^(\*{3,}|-{3,}|_{3,})$/.test(rawLines[i].trim()) &&
        !rawLines[i].trim().startsWith("|")
      ) {
        pLines.push(rawLines[i]);
        i++;
      }

      blocks.push(
        <p key={`block-${blockIndex++}`} className="m-md-p">
          {inline(pLines.join(" "), `p-${blockIndex}`)}
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
