import type { Tool } from "./index";
import { memoryDbUpdate, parseImportance } from "./memory-store";

export const rememberTool: Tool = {
  declaration: {
    name: "remember",
    description:
      "EDIT or replace the existing description stored under a memory index. Use whenever the user updates, corrects, or expands information under an index that already exists (e.g. revising the 'portfolio' description). If the index does not exist yet, use 'learn' to create it instead.",
    parameters: {
      type: "OBJECT",
      properties: {
        index: {
          type: "STRING",
          description:
            "The existing memory index (category) to edit, e.g. 'portfolio', 'preferences', 'projects'.",
        },
        description: {
          type: "STRING",
          description: "The full, updated description that replaces the current stored value.",
        },
        newIndex: {
          type: "STRING",
          description:
            "Optional. Rename the memory index to this new unique value. Without it, the index keeps its current name.",
        },
        importance: {
          type: "STRING",
          description: "Importance level: 'low', 'medium', or 'high'. Default is 'medium'.",
        },
      },
      required: ["index", "description"],
    },
  },
  execute: async (args: Record<string, unknown>) => {
    try {
      const index = String(args.index || "").trim();
      if (!index) {
        return JSON.stringify({ error: "Parameter 'index' is required." });
      }
      const description = String(args.description || "").trim();
      if (!description) {
        return JSON.stringify({
          error: "Parameter 'description' is required to update the memory.",
        });
      }
      const newIndex = args.newIndex ? String(args.newIndex).trim() : undefined;

      const entry = await memoryDbUpdate(index, {
        content: description,
        importance: parseImportance(args.importance),
        newCategory: newIndex,
      });

      return JSON.stringify({
        success: true,
        message: `Updated memory index '${entry.category}'.`,
        memory: entry,
      });
    } catch (err: any) {
      return JSON.stringify({
        error: err?.message || "Failed to update memory.",
      });
    }
  },
};