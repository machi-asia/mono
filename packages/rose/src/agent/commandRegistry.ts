import { TOOLS } from "./tools";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  termBadge: string;
  promptText: string;
}

export interface CommandCategory {
  command: string;
  label: string;
  description: string;
  icon: string;
  items: CommandItem[];
}

export const DEFAULT_COMMAND_CATEGORIES: CommandCategory[] = [
  {
    command: "/web",
    label: "Web Search",
    description: "Search the web for up-to-date information and real-time facts",
    icon: "Globe",
    items: [
      {
        id: "web-search-query",
        title: "Search the Web",
        subtitle: "Query live web results using webSearch tool",
        category: "web",
        termBadge: `@tool:"webSearch"`,
        promptText: `@tool:"webSearch" `,
      },
    ],
  },
  {
    command: "/picker",
    label: "Option Picker",
    description: "Prompt interactive choice buttons",
    icon: "ListChecks",
    items: [
      {
        id: "tool-ask-question",
        title: "Ask Interactive Question",
        subtitle: "Presents clickable choice buttons in the chat UI",
        category: "tool",
        termBadge: `@tool:"askQuestion"`,
        promptText: `@tool:"askQuestion" `,
      },
    ],
  },
  {
    command: "/memory",
    label: "Long-Term Memory",
    description: "Save important facts, preferences, and context into persistent memory",
    icon: "Brain",
    items: [
      {
        id: "tool-remember",
        title: "Remember Fact or Preference",
        subtitle: "Records details to persistent memory with rememberTool",
        category: "tool",
        termBadge: `@tool:"remember"`,
        promptText: `@tool:"remember" `,
      },
    ],
  },
  {
    command: "/tools",
    label: "Available Tools",
    description: "Inspect tools registered in Rose AI",
    icon: "Wrench",
    items: TOOLS.map((t) => ({
      id: `tool-${t.declaration.name}`,
      title: t.declaration.name,
      subtitle: t.declaration.description,
      category: "tool",
      termBadge: `@tool:"${t.declaration.name}"`,
      promptText: `@tool:"${t.declaration.name}" `,
    })),
  },
];

export function getAgentCommandCategories(customCategories?: CommandCategory[]): CommandCategory[] {
  if (!customCategories || customCategories.length === 0) {
    return DEFAULT_COMMAND_CATEGORIES;
  }
  const map = new Map<string, CommandCategory>();
  for (const cat of DEFAULT_COMMAND_CATEGORIES) {
    map.set(cat.command.toLowerCase(), cat);
  }
  for (const cat of customCategories) {
    map.set(cat.command.toLowerCase(), cat);
  }
  return Array.from(map.values());
}
