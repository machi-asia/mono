import { askQuestionTool } from "./askQuestion";
import { rememberTool, setRememberToolContext, clearRememberToolContext } from "./remember";
import { webSearchTool } from "./webSearch";

export interface ToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface Tool {
  declaration: ToolDeclaration;
  execute: (args: Record<string, unknown>) => Promise<string>;
}

export const TOOLS: Tool[] = [
  webSearchTool,
  askQuestionTool,
  rememberTool,
];

export function getToolByName(name: string): Tool | undefined {
  if (name === "rememberTool") return rememberTool;
  return TOOLS.find((t) => t.declaration.name === name);
}

export { askQuestionTool, rememberTool, setRememberToolContext, clearRememberToolContext, webSearchTool };
