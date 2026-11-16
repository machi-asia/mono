import type { Tool } from "./index";

export interface AskQuestionArgs {
  question: string;
  options: string[];
  allowMultiple?: boolean;
}

function normalizeOptionString(item: unknown): string {
  if (typeof item === "string") return item.trim();
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    const val = obj.title ?? obj.label ?? obj.text ?? obj.name ?? obj.value;
    if (val != null) return String(val).trim();
    return JSON.stringify(item);
  }
  return String(item ?? "").trim();
}

export const askQuestionTool: Tool = {
  declaration: {
    name: "askQuestion",
    description:
      "Present the user with an interactive option picker in the chat UI. Always call this tool when asking clarifying questions, offering topic choices, or suggesting next steps, rather than listing choices in plain markdown.",
    parameters: {
      type: "OBJECT",
      properties: {
        question: {
          type: "STRING",
          description: "The question or prompt to display above the choice buttons.",
        },
        options: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of selectable choice strings for the user.",
        },
        allowMultiple: {
          type: "BOOLEAN",
          description: "Whether the user can select multiple options before submitting.",
        },
      },
      required: ["question", "options"],
    },
  },
  execute: async (args: Record<string, unknown>) => {
    try {
      const question = (args.question as string) || "Please choose an option:";
      const rawOpts = args.options || (args as any).choices;
      const options = Array.isArray(rawOpts)
        ? rawOpts.map(normalizeOptionString).filter(Boolean)
        : [];
      const allowMultiple = Boolean(args.allowMultiple);

      const payload = {
        type: "interactive_options",
        question,
        options,
        allowMultiple,
      };

      return JSON.stringify(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to execute askQuestion";
      return JSON.stringify({ error: message });
    }
  },
};
