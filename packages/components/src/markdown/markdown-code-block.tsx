"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";

type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "boolean"
  | "type"
  | "function"
  | "tag"
  | "attr"
  | "property"
  | "operator"
  | "punctuation"
  | "text";

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "default",
  "function",
  "return",
  "const",
  "let",
  "var",
  "if",
  "else",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "typeof",
  "instanceof",
  "void",
  "as",
  "async",
  "await",
  "class",
  "extends",
  "implements",
  "interface",
  "type",
  "enum",
  "public",
  "private",
  "protected",
  "readonly",
  "static",
  "abstract",
  "override",
  "yield",
  "super",
  "this",
  "package",
  "while",
  "for",
  "in",
  "of",
  "do",
  "with",
  "debugger",
  // SQL
  "select",
  "where",
  "insert",
  "into",
  "values",
  "update",
  "set",
  "delete",
  "create",
  "table",
  "alter",
  "drop",
  "join",
  "left",
  "right",
  "inner",
  "outer",
  "on",
  "group",
  "by",
  "order",
  "asc",
  "desc",
  "limit",
  "offset",
  "and",
  "or",
  "not",
  "primary",
  "key",
  "foreign",
  "references",
  "index",
  "unique",
  "view",
]);

const BUILTIN_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "any",
  "unknown",
  "never",
  "object",
  "symbol",
  "bigint",
  "void",
  "Record",
  "Promise",
  "Array",
  "Map",
  "Set",
  "ReactNode",
  "React",
  "JSX",
  "FC",
  "HTMLAttributes",
  "Metadata",
  "Viewport",
  "WikiArticle",
  "WikiCategory",
  "TocEntry",
  "VARCHAR",
  "TEXT",
  "INT",
  "INTEGER",
  "BIGINT",
  "BOOLEAN",
  "TIMESTAMP",
  "TIMESTAMPTZ",
  "JSONB",
  "UUID",
  "SERIAL",
]);

const BOOLEANS_NULLS = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
]);

function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  const isBash = ["bash", "sh", "shell", "zsh"].includes(lang);
  const isSql = ["sql", "postgres", "postgresql"].includes(lang);
  const isJson = lang === "json";

  while (index < line.length) {
    const remaining = line.slice(index);

    // 1. Comments
    if (
      (!isBash && remaining.startsWith("//")) ||
      (!isBash && !isSql && remaining.startsWith("/*")) ||
      (isBash && remaining.startsWith("#")) ||
      (isSql && remaining.startsWith("--"))
    ) {
      tokens.push({ type: "comment", value: remaining });
      break;
    }

    // 2. String literals: double quotes, single quotes, template literals
    const strMatch = remaining.match(/^(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/);
    if (strMatch) {
      // In JSON, check if it's a property key e.g. "key":
      if (isJson || remaining.slice(strMatch[0].length).trimStart().startsWith(":")) {
        tokens.push({ type: "property", value: strMatch[0] });
      } else {
        tokens.push({ type: "string", value: strMatch[0] });
      }
      index += strMatch[0].length;
      continue;
    }

    // 3. JSX / HTML closing tags: </TagName> or </tag>
    const closeTagMatch = remaining.match(/^<\/\s*([a-zA-Z0-9_.:-]+)\s*>/);
    if (closeTagMatch) {
      tokens.push({ type: "punctuation", value: "</" });
      tokens.push({ type: "tag", value: closeTagMatch[1] });
      tokens.push({ type: "punctuation", value: ">" });
      index += closeTagMatch[0].length;
      continue;
    }

    // 4. JSX / HTML opening tags: <TagName or <div
    const openTagMatch = remaining.match(/^<([a-zA-Z0-9_.:-]+)(?=[\s/>]|$)/);
    if (openTagMatch && !isBash && !isSql) {
      tokens.push({ type: "punctuation", value: "<" });
      tokens.push({ type: "tag", value: openTagMatch[1] });
      index += openTagMatch[0].length;
      continue;
    }

    // 5. JSX / HTML self-closing: />
    if (remaining.startsWith("/>")) {
      tokens.push({ type: "punctuation", value: "/>" });
      index += 2;
      continue;
    }

    // 6. JSX attribute: attrName=
    const attrMatch = remaining.match(/^([a-zA-Z0-9_-]+)=/);
    if (attrMatch && !isJson) {
      tokens.push({ type: "attr", value: attrMatch[1] });
      tokens.push({ type: "operator", value: "=" });
      index += attrMatch[0].length;
      continue;
    }

    // 7. Numbers (hex, float, int)
    const numMatch = remaining.match(/^(?:0x[0-9a-fA-F]+|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/);
    if (numMatch) {
      tokens.push({ type: "number", value: numMatch[0] });
      index += numMatch[0].length;
      continue;
    }

    // 8. Operators
    const opMatch = remaining.match(/^(?:=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?|\+\+|--|\+=|-=|\*=|\/=|>>|<<|\?|:|[+\-*/%&|^~!=<>])/);
    if (opMatch) {
      tokens.push({ type: "operator", value: opMatch[0] });
      index += opMatch[0].length;
      continue;
    }

    // 9. Punctuation
    const puncMatch = remaining.match(/^[{}()[\];,.]/);
    if (puncMatch) {
      tokens.push({ type: "punctuation", value: puncMatch[0] });
      index += puncMatch[0].length;
      continue;
    }

    // 10. Words / Identifiers
    const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      const lowerWord = word.toLowerCase();
      const afterWord = remaining.slice(word.length);

      if (KEYWORDS.has(word) || KEYWORDS.has(lowerWord)) {
        tokens.push({ type: "keyword", value: word });
      } else if (BOOLEANS_NULLS.has(word)) {
        tokens.push({ type: "boolean", value: word });
      } else if (BUILTIN_TYPES.has(word) || (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase() && !isJson)) {
        tokens.push({ type: "type", value: word });
      } else if (afterWord.trimStart().startsWith("(")) {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "text", value: word });
      }
      index += word.length;
      continue;
    }

    // 11. Any other whitespace or character
    tokens.push({ type: "text", value: line[index] });
    index++;
  }

  return tokens;
}

export function highlightCode(code: string, language: string): ReactNode[] {
  const normalizedLang = (language || "text").toLowerCase().trim();
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    const tokens = tokenizeLine(line, normalizedLang);
    return (
      <span key={`line-${lineIndex}`} className="m-md-code-line">
        {tokens.map((tok, tokIndex) => {
          if (tok.type === "text") {
            return tok.value;
          }
          return (
            <span
              key={`tok-${lineIndex}-${tokIndex}`}
              className={`m-token m-token-${tok.type}`}
            >
              {tok.value}
            </span>
          );
        })}
        {lineIndex < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

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

  const highlighted = useMemo(
    () => highlightCode(code, language),
    [code, language]
  );

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
        <code>{highlighted}</code>
      </pre>
    </div>
  );
}
