import type { Tool } from "./index";
import { memoryDbDelete } from "./memory-store";

export const forgetTool: Tool = {
  declaration: {
    name: "forget",
    description:
      "DELETE a memory index and all the details stored under it. Use when the user explicitly says something should no longer be remembered (forgets a preference, removes a project, etc.).",
    parameters: {
      type: "OBJECT",
      properties: {
        index: {
          type: "STRING",
          description:
            "The memory index (category) to delete, e.g. 'portfolio', 'preferences', 'projects'.",
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

      const deleted = await memoryDbDelete(index);
      return JSON.stringify({
        success: true,
        deleted,
        index,
        message: deleted
          ? `Forgot memory index '${index}'.`
          : `No memory found for index '${index}'; nothing to forget.`,
      });
    } catch (err: any) {
      return JSON.stringify({
        error: err?.message || "Failed to forget memory.",
      });
    }
  },
};