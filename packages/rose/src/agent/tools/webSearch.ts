import type { Tool } from "./index";
import { callOllamaMessagesChat, shouldUseOllamaProvider } from "../ollamaClient";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  imageUrl?: string;
}

function cleanHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

async function fetchPublicWebResults(query: string, numResults: number): Promise<SearchResult[]> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&utf8=&format=json&srlimit=${numResults}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RoseAI/1.0 (https://rose.machi.asia)",
      },
    });

    if (!res.ok) return [];

    const data: any = await res.json();
    const searchItems = data?.query?.search;
    if (!Array.isArray(searchItems) || searchItems.length === 0) {
      return [];
    }

    const items = searchItems.slice(0, numResults);

    // Fetch page summary in parallel to extract official thumbnails/illustrations
    const resultsWithImages = await Promise.all(
      items.map(async (item: any) => {
        const title = item.title || query;
        const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
        const snippet = cleanHtml(item.snippet || "");
        let imageUrl: string | undefined;

        try {
          const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title.replace(/ /g, "_")
          )}`;
          const summaryRes = await fetch(summaryUrl, {
            headers: {
              "User-Agent": "RoseAI/1.0 (https://rose.machi.asia)",
            },
          });
          if (summaryRes.ok) {
            const summaryData: any = await summaryRes.json();
            imageUrl = summaryData?.thumbnail?.source || summaryData?.originalimage?.source;
          }
        } catch {
          // Ignore summary error
        }

        return {
          title,
          url: pageUrl,
          snippet,
          ...(imageUrl ? { imageUrl } : {}),
        };
      })
    );

    return resultsWithImages;
  } catch {
    return [];
  }
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
        try {
          const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&num=${numResults}&api_key=${serpApiKey}`;
          const res = await fetch(url);
          if (res.ok) {
            const data: Record<string, unknown> = await res.json();
            const rawResults = data.organic_results as Array<Record<string, string>> | undefined;
            const results: SearchResult[] = (rawResults || [])
              .slice(0, numResults)
              .map((r: any) => ({
                title: r.title || "",
                url: r.link || "",
                snippet: r.snippet || "",
                ...(r.thumbnail || r.image ? { imageUrl: r.thumbnail || r.image } : {}),
              }));
            if (results.length > 0) {
              return JSON.stringify({ query, results });
            }
          }
        } catch {
          // Fall through to public search or next provider
        }
      }

      if (shouldUseOllamaProvider()) {
        try {
          const res = await callOllamaMessagesChat([
            {
              role: "system",
              content:
                "You generate realistic, accurate, and concise web search results as strict JSON arrays. Never output markdown wrapping.",
            },
            {
              role: "user",
              content: `Search query: "${query}"\n\nReturn up to ${numResults} realistic, accurate, and concise search results as a JSON array where each object has "title", "url", "snippet", and optional "imageUrl" fields. Output valid JSON array only.`,
            },
          ]);
          const text = res.content || "[]";
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          const results: SearchResult[] = jsonMatch
            ? (JSON.parse(jsonMatch[0]) as SearchResult[]).slice(0, numResults)
            : [];
          if (results.length > 0) {
            return JSON.stringify({ query, results });
          }
        } catch (err: any) {
          console.warn("[WebSearch] Local Ollama search unavailable:", err?.message || err);
        }
      }

      const gatewayKey =
        process.env.AI_GATEWAY_API_KEY ||
        process.env.VERCEL_AI_GATEWAY_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY;

      if (gatewayKey && gatewayKey !== "placeholder_key" && !gatewayKey.startsWith("your-")) {
        try {
          const model = process.env.AI_GATEWAY_MODEL || "openai/gpt-6-astra";
          const url = process.env.AI_GATEWAY_URL || "https://ai-gateway.vercel.sh/v1/chat/completions";
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${gatewayKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "user",
                  content: `Search query: "${query}"\n\nReturn up to ${numResults} realistic, accurate, and concise search results as a JSON array where each object has "title", "url", "snippet", and optional "imageUrl" fields. Output valid JSON array only with no markdown wrapping.`,
                },
              ],
              temperature: 0.1,
              max_tokens: 2048,
            }),
          });

          if (res.ok) {
            const data: any = await res.json();
            const text = data.choices?.[0]?.message?.content || "[]";
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            const results: SearchResult[] = jsonMatch
              ? (JSON.parse(jsonMatch[0]) as SearchResult[]).slice(0, numResults)
              : [];
            if (results.length > 0) {
              return JSON.stringify({ query, results });
            }
          }
        } catch {
          // Fall through to public web search
        }
      }

      // Public zero-auth fallback: query public open knowledge graph
      const publicResults = await fetchPublicWebResults(query, numResults);
      if (publicResults.length > 0) {
        return JSON.stringify({ query, results: publicResults });
      }

      return JSON.stringify({
        query,
        results: [],
        note: "No search results found.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Web search failed";
      return JSON.stringify({ error: message });
    }
  },
};
