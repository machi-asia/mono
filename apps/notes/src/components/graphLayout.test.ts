import { describe, expect, it } from "vitest";
import { computeNoteGraphLayout } from "./graphLayout";
import { extractWikilinkTitles } from "./NoteGraph";

describe("computeNoteGraphLayout", () => {
  it("computes bounded coordinates and degree-scaled radii", () => {
    const result = computeNoteGraphLayout(
      [
        { id: 1, label: "Hub", folder: "Engineering", tags: ["arch"] },
        { id: 2, label: "Algorithms", folder: "Research", tags: ["graph"] },
        { id: 3, label: "Release", folder: "Engineering", tags: ["ci"] },
      ],
      [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
      ],
      800,
      500
    );

    expect(result.nodes).toHaveLength(3);
    expect(result.edges).toHaveLength(2);
    const hub = result.nodes.find((n) => n.id === 1);
    const leaf = result.nodes.find((n) => n.id === 2);
    expect(hub?.degree).toBe(2);
    expect(leaf?.degree).toBe(1);
    expect((hub?.radius ?? 0) > (leaf?.radius ?? 0)).toBe(true);
    for (const node of result.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(50);
      expect(node.x).toBeLessThanOrEqual(750);
      expect(node.y).toBeGreaterThanOrEqual(40);
      expect(node.y).toBeLessThanOrEqual(460);
    }
  });

  it("extracts [[Wikilinks]] from markdown text", () => {
    expect(extractWikilinkTitles("Links to [[Note A]] and [[Note B]].")).toEqual([
      "Note A",
      "Note B",
    ]);
  });
});
