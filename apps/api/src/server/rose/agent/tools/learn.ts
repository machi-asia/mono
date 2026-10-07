import type { Tool } from "./index";
import { memoryDbCreate, parseImportance } from "./memory-store";

export const learnTool: Tool = {
  declaration: {
    name: "learn",
    description:
      "WRITE a new long-term memory entry keyed by a unique index (the memory 'index'/category). Each index holds ONE full description. Use ONLY when the user shares brand-new information, preferences, projects, or facts that have no existing index yet. Never overwrite an existing index here — if an index already exists, use 'remember' to edit it.",
    parameters: {
      type: "OBJECT",
      properties: {
        index: {
          type: "STRING",
          description:
            "Unique memory index (category) that organizes the topic, e.g. 'portfolio', 'preferences', 'projects', 'goals', 'allergies'.",
        },
        description: {
          type: "STRING",
          description: "The full description and details to remember for this index.",
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
        return JSON.stringify({ error: "Parameter 'description' is required." });
      }

      const entry = await memoryDbCreate(index, description, parseImportance(args.importance));
      return JSON.stringify({
        success: true,
        message: `Learned a new memory index '${entry.category}'.`,
        memory: entry,
      });
    } catch (err: any) {
      return JSON.stringify({
        error: err?.message || "Failed to learn memory.",
      });
    }
  },
};