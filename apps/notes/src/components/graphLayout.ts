export interface GraphNodeInput {
  id: number;
  label: string;
  folder: string;
  tags: string[];
}

export interface GraphEdgeInput {
  source: number;
  target: number;
}

export interface PositionedGraphNode extends GraphNodeInput {
  x: number;
  y: number;
  degree: number;
  radius: number;
  color: string;
}

export interface PositionedGraphEdge {
  source: number;
  target: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const FOLDER_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
];

function folderColor(folder: string, folderIndexMap: Map<string, number>): string {
  const key = folder || "General";
  let idx = folderIndexMap.get(key);
  if (idx === undefined) {
    idx = folderIndexMap.size;
    folderIndexMap.set(key, idx);
  }
  return FOLDER_PALETTE[idx % FOLDER_PALETTE.length] ?? "#3b82f6";
}

export function computeNoteGraphLayout(
  nodes: GraphNodeInput[],
  edges: GraphEdgeInput[],
  width = 860,
  height = 520
): { nodes: PositionedGraphNode[]; edges: PositionedGraphEdge[] } {
  if (nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const cx = width / 2;
  const cy = height / 2;
  const folderMap = new Map<string, number>();

  const degreeMap = new Map<number, number>();
  for (const edge of edges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) ?? 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) ?? 0) + 1);
  }

  const state = nodes.map((n, index) => {
    const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2;
    const ringRadius = Math.min(width, height) * 0.28 + (index % 2) * 35;
    const degree = degreeMap.get(n.id) ?? 0;
    return {
      ...n,
      x: cx + Math.cos(angle) * ringRadius,
      y: cy + Math.sin(angle) * ringRadius,
      vx: 0,
      vy: 0,
      degree,
      radius: 12 + Math.min(12, degree * 3),
      color: folderColor(n.folder, folderMap),
    };
  });

  const nodeById = new Map(state.map((n) => [n.id, n]));

  // Lightweight deterministic relaxation passes
  for (let step = 0; step < 65; step++) {
    for (let i = 0; i < state.length; i++) {
      for (let j = i + 1; j < state.length; j++) {
        const a = state[i]!;
        const b = state[j]!;
        const dx = b.x - a.x || 0.5;
        const dy = b.y - a.y || 0.5;
        const distSq = Math.max(400, dx * dx + dy * dy);
        const force = 5200 / distSq;
        const dist = Math.sqrt(distSq);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    for (const edge of edges) {
      const s = nodeById.get(edge.source);
      const t = nodeById.get(edge.target);
      if (!s || !t) continue;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const targetLen = 155;
      const pull = (dist - targetLen) * 0.045;
      const fx = (dx / dist) * pull;
      const fy = (dy / dist) * pull;
      s.vx += fx;
      s.vy += fy;
      t.vx -= fx;
      t.vy -= fy;
    }

    for (const n of state) {
      n.vx += (cx - n.x) * 0.015;
      n.vy += (cy - n.y) * 0.015;
      n.x = Math.max(58, Math.min(width - 58, n.x + n.vx * 0.45));
      n.y = Math.max(48, Math.min(height - 48, n.y + n.vy * 0.45));
      n.vx *= 0.65;
      n.vy *= 0.65;
    }
  }

  const positionedEdges: PositionedGraphEdge[] = [];
  for (const edge of edges) {
    const s = nodeById.get(edge.source);
    const t = nodeById.get(edge.target);
    if (!s || !t) continue;
    positionedEdges.push({
      source: edge.source,
      target: edge.target,
      x1: Number(s.x.toFixed(1)),
      y1: Number(s.y.toFixed(1)),
      x2: Number(t.x.toFixed(1)),
      y2: Number(t.y.toFixed(1)),
    });
  }

  return {
    nodes: state.map((n) => ({
      id: n.id,
      label: n.label,
      folder: n.folder,
      tags: n.tags,
      degree: n.degree,
      radius: n.radius,
      color: n.color,
      x: Number(n.x.toFixed(1)),
      y: Number(n.y.toFixed(1)),
    })),
    edges: positionedEdges,
  };
}
