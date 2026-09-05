import type { Tool } from "./index";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export const webSearchTool: Tool = {
  declaration: {
    name: "webSearch",
    description:
      "Search the web for up-to-date information, real-time facts, documentation, or news. Returns relevant search results with titles, URLs, and summaries.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query string to look up.",
        },
        numResults: {
          type: "NUMBER",
          description: "Number of results to retrieve (default 5, max 10).",
        },
      },
      required: ["query"],
    },
  },
  execute: async (args: Record<string, unknown>) => {
    try {
      const query = args.query as string;
      if (!query) {
        return JSON.stringify({ error: "query parameter is required." });
      }

      const numResults = Math.min(Math.max(Number(args.numResults) || 5, 1), 10);

      const serpApiKey =
        process.env.SERPAPI_KEY ||
        process.env.GOOGLE_SEARCH_API_KEY;

      if (serpApiKey) {
        const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&num=${numResults}&api_key=${serpApiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          return JSON.stringify({ error: `Search API returned status ${res.status}` });
        }
        const data: Record<string, unknown> = await res.json();
        const rawResults = data.organic_results as Array<Record<string, string>> | undefined;
        const results: SearchResult[] = (rawResults || [])
          .slice(0, numResults)
          .map((r) => ({
            title: r.title || "",
            url: r.link || "",
            snippet: r.snippet || "",
          }));
        return JSON.stringify({ query, results });
      }

      const geminiKey =
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY;

      if (geminiKey) {
        const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Search query: "${query}"\n\nReturn up to ${numResults} realistic, accurate, and concise search results as a JSON array where each object has "title", "url", and "snippet" fields. Output valid JSON array only with no markdown wrapping.`,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
          }),
        });

        if (!res.ok) {
          return JSON.stringify({ error: `Search engine query failed with status ${res.status}` });
        }

        const data: Record<string, unknown> = await res.json();
        const candidates = data.candidates as Array<{
          content?: { parts: Array<{ text?: string }> };
        }> | undefined;
        const text = candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const results: SearchResult[] = jsonMatch
          ? (JSON.parse(jsonMatch[0]) as SearchResult[]).slice(0, numResults)
          : [];
        return JSON.stringify({ query, results });
      }

      return JSON.stringify({
        query,
        results: [],
        note: "No search provider key configured. Set SERPAPI_KEY or GEMINI_API_KEY.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Web search failed";
      return JSON.stringify({ error: message });
    }
  },
};
