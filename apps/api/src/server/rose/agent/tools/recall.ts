import type { Tool } from "./index";
import { memoryDbRead } from "./memory-store";

export const recallTool: Tool = {
  declaration: {
    name: "recall",
    description:
      "READ the full description stored under a memory index. Use whenever you need the details behind any index shown in the memory index list, e.g. recall('portfolio') opens the portfolio memory. Do not guess the contents of an index — always recall it before referencing its details.",
    parameters: {
      type: "OBJECT",
      properties: {
        index: {
          type: "STRING",
          description:
            "The memory index (category) to read, exactly as listed, e.g. 'portfolio', 'preferences', 'projects'.",
        },
      },
      required: ["index"],
    },
  },
  execute: async (args: Record<string, unknown>) => {
    try {
      const index = String(args.index || "").trim();
      if (!index) {
        return JSON.stringify({ error: "Parameter 'index' is required." });
      }

      const entry = await memoryDbRead(index);
      if (!entry) {
        return JSON.stringify({
          notFound: true,
          index,
          message: `No memory found for index '${index}'. If the user provides this information, use 'learn' to create it.`,
        });
      }

      return JSON.stringify({
        success: true,
        index: entry.category,
        description: entry.content,
        importance: entry.importance,
        updatedAt: entry.updated_at || entry.created_at,
      });
    } catch (err: any) {
      return JSON.stringify({
        error: err?.message || "Failed to recall memory.",
      });
    }
  },
};