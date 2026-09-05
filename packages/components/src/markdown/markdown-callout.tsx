"use client";

import { useState, type ReactNode } from "react";
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
  ChevronDown,
  ChevronRight,
} from "lucide-react";

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

export interface CalloutConfig {
  type: CalloutType;
  title: string;
  icon: typeof Info;
  className: string;
}

export const CALLOUT_CONFIGS: Record<string, CalloutConfig> = {
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

export function Callout({
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
