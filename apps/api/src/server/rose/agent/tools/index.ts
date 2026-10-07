import { askQuestionTool } from "./askQuestion";
import { learnTool } from "./learn";
import { recallTool } from "./recall";
import { rememberTool } from "./remember";
import { forgetTool } from "./forget";
import { webSearchTool } from "./webSearch";
import {
  setMemoryToolContext,
  clearMemoryToolContext,
} from "./memory-store";

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
  learnTool,
  recallTool,
  rememberTool,
  forgetTool,
];

export function getToolByName(name: string): Tool | undefined {
  if (name === "rememberTool") return rememberTool;
  return TOOLS.find((t) => t.declaration.name === name);
}

export const setRememberToolContext = setMemoryToolContext;
export const clearRememberToolContext = clearMemoryToolContext;

export {
  askQuestionTool,
  learnTool,
  recallTool,
  rememberTool,
  forgetTool,
  webSearchTool,
};