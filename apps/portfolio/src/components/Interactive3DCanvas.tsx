"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { GeometryPreset3D, RenderMode3D } from "../data/showcase-media";

export interface Interactive3DCanvasProps {
  preset?: GeometryPreset3D;
  renderMode?: RenderMode3D;
  modelUrl?: string;
  height?: number | string;
  className?: string;
  interactiveOrbit?: boolean;
  scrollWeight?: number;
  onBump?: (bumpCount: number) => void;
  label?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Mesh3D {
  vertices: Vec3[];
  faces: [number, number, number][];
  edges: [number, number][];
}

interface ProjectedVertex {
  sx: number;
  sy: number;
  rx: number;
  ry: number;
  rz: number;
  persp: number;
}

interface FaceDrawItem {
  a: number;
  b: number;
  c: number;
  avgZ: number;
  fill: string;
  stroke: string;
}

interface EdgeDrawItem {
  a: number;
  b: number;
  avgZ: number;
}

interface PhysicsState {
  baseRotX: number;
  baseRotY: number;
  dragRotX: number;
  dragRotY: number;
  orbitVelX: number;
  orbitVelY: number;
  targetScrollY: number;
  smoothScrollY: number;
  bumpScale: number;
  bumpVelocity: number;
  radialPulse: number;
  shockwaveRadius: number;
  shockwaveAlpha: number;
  time: number;
}

function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scaleVec(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len < 1e-8) {
    return { x: 0, y: 0, z: 1 };
  }
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function buildUniqueEdges(faces: [number, number, number][], extraEdges: [number, number][] = []): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];

  const pushEdge = (u: number, v: number) => {
    if (u === v) return;
    const min = Math.min(u, v);
    const max = Math.max(u, v);
    const key = `${min}:${max}`;
    if (!seen.has(key)) {
      seen.add(key);
      edges.push([min, max]);
    }
  };

  for (const [a, b, c] of faces) {
    pushEdge(a, b);
    pushEdge(b, c);
    pushEdge(c, a);
  }

  for (const [u, v] of extraEdges) {
    pushEdge(u, v);
  }

  return edges;
}

function generateTorusKnot(): Mesh3D {
  const uSeg = 36;
  const vSeg = 8;
  const p = 2;
  const q = 3;
  const majorR = 0.68;
  const minorR = 0.27;
  const tubeR = 0.175;

  const evalCurve = (t: number): Vec3 => ({
    x: (majorR + minorR * Math.cos(q * t)) * Math.cos(p * t),
    y: (majorR + minorR * Math.cos(q * t)) * Math.sin(p * t),
    z: minorR * Math.sin(q * t) * 1.4,
  });

  const vertices: Vec3[] = [];
  const faces: [number, number, number][] = [];
  const eps = 0.002;

  for (let i = 0; i < uSeg; i++) {
    const t = (i / uSeg) * Math.PI * 2;
    const center = evalCurve(t);
    const next = evalCurve(t + eps);
    const prev = evalCurve(t - eps);
    const tangent = normalize(sub(next, prev));
    const normal = normalize(cross(tangent, center));
    const binormal = normalize(cross(tangent, normal));

    for (let j = 0; j < vSeg; j++) {
      const phi = (j / vSeg) * Math.PI * 2;
      const radial = add(
        scaleVec(normal, Math.cos(phi) * tubeR),
        scaleVec(binormal, Math.sin(phi) * tubeR)
      );
      vertices.push(add(center, radial));
    }
  }

  for (let i = 0; i < uSeg; i++) {
    const nextI = (i + 1) % uSeg;
    for (let j = 0; j < vSeg; j++) {
      const nextJ = (j + 1) % vSeg;
      const v00 = i * vSeg + j;
      const v10 = nextI * vSeg + j;
      const v11 = nextI * vSeg + nextJ;
      const v01 = i * vSeg + nextJ;

      faces.push([v00, v10, v11]);
      faces.push([v00, v11, v01]);
    }
  }

  return {
    vertices,
    faces,
    edges: buildUniqueEdges(faces),
  };
}

function generateIcosahedronCore(): Mesh3D {
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseVertices: Vec3[] = [
    { x: -1, y: phi, z: 0 },
    { x: 1, y: phi, z: 0 },
    { x: -1, y: -phi, z: 0 },
    { x: 1, y: -phi, z: 0 },
    { x: 0, y: -1, z: phi },
    { x: 0, y: 1, z: phi },
    { x: 0, y: -1, z: -phi },
    { x: 0, y: 1, z: -phi },
    { x: phi, y: 0, z: -1 },
    { x: phi, y: 0, z: 1 },
    { x: -phi, y: 0, z: -1 },
    { x: -phi, y: 0, z: 1 },
  ].map(normalize);

  const baseFaces: [number, number, number][] = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  const outerVertices = baseVertices.map((v) => scaleVec(v, 1.0));
  let outerFaces = [...baseFaces];

  for (let level = 0; level < 2; level++) {
    const midCache = new Map<string, number>();
    const nextFaces: [number, number, number][] = [];

    const getMidpoint = (i1: number, i2: number): number => {
      const min = Math.min(i1, i2);
      const max = Math.max(i1, i2);
      const key = `${min}:${max}`;
      const cached = midCache.get(key);
      if (cached !== undefined) {
        return cached;
      }

      const v1 = outerVertices[i1];
      const v2 = outerVertices[i2];
      const mid = normalize({
        x: (v1.x + v2.x) * 0.5,
        y: (v1.y + v2.y) * 0.5,
        z: (v1.z + v2.z) * 0.5,
      });
      const idx = outerVertices.length;
      outerVertices.push(mid);
      midCache.set(key, idx);
      return idx;
    };

    for (const [a, b, c] of outerFaces) {
      const ab = getMidpoint(a, b);
      const bc = getMidpoint(b, c);
      const ca = getMidpoint(c, a);
      nextFaces.push([a, ab, ca]);
      nextFaces.push([b, bc, ab]);
      nextFaces.push([c, ca, bc]);
      nextFaces.push([ab, bc, ca]);
    }
    outerFaces = nextFaces;
  }

  // Add inner counter-rotated polyhedral kernel
  const innerOffset = outerVertices.length;
  const cosA = Math.cos(Math.PI / 5);
  const sinA = Math.sin(Math.PI / 5);

  for (const v of baseVertices) {
    const rx = v.x * cosA - v.z * sinA;
    const rz = v.x * sinA + v.z * cosA;
    outerVertices.push({ x: rx * 0.46, y: v.y * 0.46, z: rz * 0.46 });
  }

  for (const [a, b, c] of baseFaces) {
    outerFaces.push([a + innerOffset, b + innerOffset, c + innerOffset]);
  }

  return {
    vertices: outerVertices,
    faces: outerFaces,
    edges: buildUniqueEdges(outerFaces),
  };
}

function generateOctahedronLattice(): Mesh3D {
  const vertices: Vec3[] = [];
  const faces: [number, number, number][] = [];
  const extraEdges: [number, number][] = [];

  const appendOctahedron = (
    center: Vec3,
    radius: number,
    rotY = 0,
    rotX = 0
  ): number => {
    const baseOffset = vertices.length;
    const rawPts: Vec3[] = [
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: -1, z: 0 },
    ];

    const cy = Math.cos(rotY);
    const sy = Math.sin(rotY);
    const cx = Math.cos(rotX);
    const sx = Math.sin(rotX);

    for (const p of rawPts) {
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx;
      const z2 = p.y * sx + z1 * cx;
      vertices.push({
        x: center.x + x1 * radius,
        y: center.y + y2 * radius,
        z: center.z + z2 * radius,
      });
    }

    const octFaces: [number, number, number][] = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 1],
      [5, 2, 1],
      [5, 3, 2],
      [5, 4, 3],
      [5, 1, 4],
    ];

    for (const [a, b, c] of octFaces) {
      faces.push([baseOffset + a, baseOffset + b, baseOffset + c]);
    }

    return baseOffset;
  };

  // Primary outer shell, rotated secondary shell, and central dense core
  const outerIdx = appendOctahedron({ x: 0, y: 0, z: 0 }, 1.05, 0, 0);
  const rotatedIdx = appendOctahedron(
    { x: 0, y: 0, z: 0 },
    0.84,
    Math.PI / 4,
    Math.PI / 6
  );
  const coreIdx = appendOctahedron({ x: 0, y: 0, z: 0 }, 0.42, 0, 0);

  // Six cardinal structural satellite nodes
  const cardinals: Vec3[] = [
    { x: 1.04, y: 0, z: 0 },
    { x: -1.04, y: 0, z: 0 },
    { x: 0, y: 1.04, z: 0 },
    { x: 0, y: -1.04, z: 0 },
    { x: 0, y: 0, z: 1.04 },
    { x: 0, y: 0, z: -1.04 },
  ];

  for (const pos of cardinals) {
    appendOctahedron(pos, 0.16, Math.PI / 4, 0);
  }

  for (let i = 0; i < 6; i++) {
    extraEdges.push([outerIdx + i, coreIdx + i]);
    extraEdges.push([outerIdx + i, rotatedIdx + i]);
  }

  return {
    vertices,
    faces,
    edges: buildUniqueEdges(faces, extraEdges),
  };
}

function generateCyberGyroid(): Mesh3D {
  const n = 8;
  const gridDim = n + 1;
  const bound = 1.12;
  const step = (bound * 2) / n;
  const k = Math.PI * 1.4;

  const evalField = (x: number, y: number, z: number): number => {
    const gyroid =
      Math.cos(k * x) * Math.sin(k * y) +
      Math.cos(k * y) * Math.sin(k * z) +
      Math.cos(k * z) * Math.sin(k * x);
    const envelope = 1.45 * (x * x + y * y + z * z - 0.8);
    return gyroid + envelope;
  };

  const evalGradient = (v: Vec3): Vec3 => ({
    x:
      -k * Math.sin(k * v.x) * Math.sin(k * v.y) +
      k * Math.cos(k * v.z) * Math.cos(k * v.x) +
      2.9 * v.x,
    y:
      k * Math.cos(k * v.x) * Math.cos(k * v.y) -
      k * Math.sin(k * v.y) * Math.sin(k * v.z) +
      2.9 * v.y,
    z:
      k * Math.cos(k * v.y) * Math.cos(k * v.z) -
      k * Math.sin(k * v.z) * Math.sin(k * v.x) +
      2.9 * v.z,
  });

  const gridPoints: Vec3[] = new Array(gridDim * gridDim * gridDim);
  const gridValues = new Float64Array(gridDim * gridDim * gridDim);

  const gridIndex = (ix: number, iy: number, iz: number) =>
    ix + gridDim * (iy + gridDim * iz);

  for (let iz = 0; iz < gridDim; iz++) {
    const z = -bound + iz * step;
    for (let iy = 0; iy < gridDim; iy++) {
      const y = -bound + iy * step;
      for (let ix = 0; ix < gridDim; ix++) {
        const x = -bound + ix * step;
        const idx = gridIndex(ix, iy, iz);
        gridPoints[idx] = { x, y, z };
        gridValues[idx] = evalField(x, y, z);
      }
    }
  }

  const vertices: Vec3[] = [];
  const faces: [number, number, number][] = [];
  const edgeCache = new Map<string, number>();

  const interpolateEdge = (i1: number, i2: number): number => {
    const min = Math.min(i1, i2);
    const max = Math.max(i1, i2);
    const key = `${min}:${max}`;
    const existing = edgeCache.get(key);
    if (existing !== undefined) {
      return existing;
    }

    const p1 = gridPoints[i1];
    const p2 = gridPoints[i2];
    const v1 = gridValues[i1];
    const v2 = gridValues[i2];
    const denom = v2 - v1;
    const t = Math.abs(denom) < 1e-6 ? 0.5 : Math.max(0, Math.min(1, -v1 / denom));

    const idx = vertices.length;
    vertices.push({
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
      z: p1.z + (p2.z - p1.z) * t,
    });
    edgeCache.set(key, idx);
    return idx;
  };

  const pushOrientedTri = (a: number, b: number, c: number) => {
    if (a === b || b === c || a === c) return;
    const va = vertices[a];
    const vb = vertices[b];
    const vc = vertices[c];
    const triNormal = cross(sub(vb, va), sub(vc, va));
    const centroid: Vec3 = {
      x: (va.x + vb.x + vc.x) / 3,
      y: (va.y + vb.y + vc.y) / 3,
      z: (va.z + vb.z + vc.z) / 3,
    };
    const grad = evalGradient(centroid);
    if (dot(triNormal, grad) < 0) {
      faces.push([a, c, b]);
    } else {
      faces.push([a, b, c]);
    }
  };

  // 6-tetrahedra cube partition along main diagonal (0 -> 7)
  const tets: [number, number, number, number][] = [
    [0, 1, 3, 7],
    [0, 3, 2, 7],
    [0, 2, 6, 7],
    [0, 6, 4, 7],
    [0, 4, 5, 7],
    [0, 5, 1, 7],
  ];

  for (let iz = 0; iz < n; iz++) {
    for (let iy = 0; iy < n; iy++) {
      for (let ix = 0; ix < n; ix++) {
        const corners = [
          gridIndex(ix, iy, iz),
          gridIndex(ix + 1, iy, iz),
          gridIndex(ix, iy + 1, iz),
          gridIndex(ix + 1, iy + 1, iz),
          gridIndex(ix, iy, iz + 1),
          gridIndex(ix + 1, iy, iz + 1),
          gridIndex(ix, iy + 1, iz + 1),
          gridIndex(ix + 1, iy + 1, iz + 1),
        ];

        for (const [t0, t1, t2, t3] of tets) {
          const tetNodes = [corners[t0], corners[t1], corners[t2], corners[t3]];
          const inside: number[] = [];
          const outside: number[] = [];

          for (const nodeIdx of tetNodes) {
            if (gridValues[nodeIdx] < 0) {
              inside.push(nodeIdx);
            } else {
              outside.push(nodeIdx);
            }
          }

          if (inside.length === 1) {
            const p0 = interpolateEdge(inside[0], outside[0]);
            const p1 = interpolateEdge(inside[0], outside[1]);
            const p2 = interpolateEdge(inside[0], outside[2]);
            pushOrientedTri(p0, p1, p2);
          } else if (inside.length === 3) {
            const p0 = interpolateEdge(outside[0], inside[0]);
            const p1 = interpolateEdge(outside[0], inside[1]);
            const p2 = interpolateEdge(outside[0], inside[2]);
            pushOrientedTri(p0, p1, p2);
          } else if (inside.length === 2) {
            const p00 = interpolateEdge(inside[0], outside[0]);
            const p01 = interpolateEdge(inside[0], outside[1]);
            const p10 = interpolateEdge(inside[1], outside[0]);
            const p11 = interpolateEdge(inside[1], outside[1]);
            pushOrientedTri(p00, p01, p11);
            pushOrientedTri(p00, p11, p10);
          }
        }
      }
    }
  }

  return {
    vertices,
    faces,
    edges: buildUniqueEdges(faces),
  };
}

function generatePresetMesh(preset: GeometryPreset3D): Mesh3D {
  switch (preset) {
    case "torus-knot":
      return generateTorusKnot();
    case "icosahedron-core":
      return generateIcosahedronCore();
    case "octahedron-lattice":
      return generateOctahedronLattice();
    case "cyber-gyroid":
      return generateCyberGyroid();
    default:
      return generateTorusKnot();
  }
}

const KEY_LIGHT = normalize({ x: -0.45, y: -0.58, z: 0.72 });
const RIM_LIGHT = normalize({ x: 0.65, y: 0.45, z: -0.55 });

export function Interactive3DCanvas({
  preset = "torus-knot",
  renderMode = "shaded",
  modelUrl,
  height = 420,
  className = "",
  interactiveOrbit = true,
  scrollWeight = 1,
  onBump,
  label,
}: Interactive3DCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [bumpCount, setBumpCount] = useState(0);
  const bumpCountRef = useRef(0);
  const onBumpRef = useRef(onBump);
  useEffect(() => {
    onBumpRef.current = onBump;
  }, [onBump]);

  const mesh = useMemo(() => generatePresetMesh(preset), [preset]);

  const physicsRef = useRef<PhysicsState>({
    baseRotX: 0.36,
    baseRotY: 0.42,
    dragRotX: 0,
    dragRotY: 0,
    orbitVelX: 0,
    orbitVelY: 0,
    targetScrollY: 0,
    smoothScrollY: 0,
    bumpScale: 1,
    bumpVelocity: 0,
    radialPulse: 0,
    shockwaveRadius: 0,
    shockwaveAlpha: 0,
    time: 0,
  });

  const dragStateRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    totalDist: 0,
    wasLongDrag: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initialScrollY =
      typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0;
    physicsRef.current.targetScrollY = initialScrollY;
    physicsRef.current.smoothScrollY = initialScrollY;

    let width = 480;
    let stageHeight = 360;

    const syncCanvasSize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect();
      width = Math.max(240, Math.round(rect?.width || parent?.clientWidth || 480));
      stageHeight = Math.max(200, Math.round(rect?.height || parent?.clientHeight || 360));
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(stageHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncCanvasSize();

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      physicsRef.current.targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", syncCanvasSize);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        syncCanvasSize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    let rafId: number | null = null;
    let lastTimestamp = typeof performance !== "undefined" ? performance.now() : 0;
    let isDisposed = false;

    const projected: ProjectedVertex[] = new Array(mesh.vertices.length);

    const drawFrame = (timestamp: number) => {
      if (isDisposed) return;

      const rawDt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const dt = Number.isFinite(rawDt) && rawDt > 0 ? Math.min(0.033, rawDt) : 0.016;

      const phys = physicsRef.current;
      phys.time += dt;

      // Smooth scroll coupling
      phys.smoothScrollY += (phys.targetScrollY - phys.smoothScrollY) * 0.14;
      const scrollRotY = phys.smoothScrollY * 0.004 * scrollWeight;
      const scrollRotX = phys.smoothScrollY * 0.002 * scrollWeight;
      const cameraTiltX = Math.sin(phys.smoothScrollY * 0.0015 * scrollWeight) * 0.16;

      // Ambient idle spin + inertia decay
      phys.baseRotY += dt * 0.24;
      phys.baseRotX += dt * 0.08;
      if (!dragStateRef.current.isDragging) {
        phys.dragRotX += phys.orbitVelX;
        phys.dragRotY += phys.orbitVelY;
        phys.orbitVelX *= 0.93;
        phys.orbitVelY *= 0.93;
      }

      // Click-bump spring oscillator
      const springForce = (1.0 - phys.bumpScale) * 210;
      phys.bumpVelocity = (phys.bumpVelocity + springForce * dt) * 0.87;
      phys.bumpScale += phys.bumpVelocity * dt;
      if (Math.abs(1.0 - phys.bumpScale) < 0.0005 && Math.abs(phys.bumpVelocity) < 0.0005) {
        phys.bumpScale = 1.0;
        phys.bumpVelocity = 0;
      }

      phys.radialPulse *= 0.9;
      if (phys.radialPulse < 0.002) {
        phys.radialPulse = 0;
      }

      if (phys.shockwaveAlpha > 0.01) {
        phys.shockwaveRadius += dt * 2.3;
        phys.shockwaveAlpha *= 0.91;
      } else {
        phys.shockwaveAlpha = 0;
      }

      // Clear background cleanly
      ctx.clearRect(0, 0, width, stageHeight);

      const cx = width * 0.5;
      const cy = stageHeight * 0.5;
      const minDim = Math.min(width, stageHeight);
      const radiusPx = minDim * 0.32 * phys.bumpScale;

      // Shockwave ring during click-bump impulse
      if (phys.shockwaveAlpha > 0.01) {
        ctx.strokeStyle = `rgba(244, 244, 240, ${Math.min(0.85, phys.shockwaveAlpha).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * (0.24 + phys.shockwaveRadius * 0.26), 0, Math.PI * 2);
        ctx.stroke();
      }

      const rotX = phys.baseRotX + scrollRotX + phys.dragRotX + cameraTiltX;
      const rotY = phys.baseRotY + scrollRotY + phys.dragRotY;
      const sinX = Math.sin(rotX);
      const cosX = Math.cos(rotX);
      const sinY = Math.sin(rotY);
      const cosY = Math.cos(rotY);
      const fov = 3.2;

      // Project all vertices
      for (let i = 0; i < mesh.vertices.length; i++) {
        const v = mesh.vertices[i];
        const pulse =
          phys.radialPulse > 0
            ? 1 + phys.radialPulse * 0.14 * Math.sin(i * 0.65 + phys.time * 22)
            : 1;

        const px = v.x * pulse;
        const py = v.y * pulse;
        const pz = v.z * pulse;

        // Rotate around Y then X
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const depth = Math.max(0.65, fov - z2);
        const persp = fov / depth;
        projected[i] = {
          sx: cx + x1 * radiusPx * persp,
          sy: cy + y2 * radiusPx * persp,
          rx: x1,
          ry: y2,
          rz: z2,
          persp,
        };
      }

      if (renderMode === "shaded") {
        const faceList: FaceDrawItem[] = [];

        for (let i = 0; i < mesh.faces.length; i++) {
          const [ia, ib, ic] = mesh.faces[i];
          const va = projected[ia];
          const vb = projected[ib];
          const vc = projected[ic];

          // 3D normal in view space
          const ux = vb.rx - va.rx;
          const uy = vb.ry - va.ry;
          const uz = vb.rz - va.rz;
          const vx = vc.rx - va.rx;
          const vy = vc.ry - va.ry;
          const vz = vc.rz - va.rz;

          let nx = uy * vz - uz * vy;
          let ny = uz * vx - ux * vz;
          let nz = ux * vy - uy * vx;
          const nLen = Math.hypot(nx, ny, nz);
          if (nLen < 1e-6) continue;
          nx /= nLen;
          ny /= nLen;
          nz /= nLen;

          // Ensure normal points toward viewer for consistent obsidian metallic shading
          if (nz < 0) {
            nx = -nx;
            ny = -ny;
            nz = -nz;
          }

          const keyDot = Math.max(0, nx * KEY_LIGHT.x + ny * KEY_LIGHT.y + nz * KEY_LIGHT.z);
          const rimDot = Math.max(0, nx * RIM_LIGHT.x + ny * RIM_LIGHT.y + nz * RIM_LIGHT.z);
          const fresnel = Math.pow(1 - Math.min(1, Math.abs(nz)), 2.2);

          // Multi-shade obsidian/graphite metallic palette with #f4f4f0 rim accents
          const specular = Math.pow(keyDot, 5) * 0.65 + rimDot * 0.2;
          const shadeR = Math.round(7 + keyDot * 44 + fresnel * 42 + specular * 115);
          const shadeG = Math.round(7 + keyDot * 45 + fresnel * 42 + specular * 115);
          const shadeB = Math.round(10 + keyDot * 54 + fresnel * 46 + specular * 108);

          const edgeAlpha = 0.07 + fresnel * 0.24 + specular * 0.22;

          faceList.push({
            a: ia,
            b: ib,
            c: ic,
            avgZ: (va.rz + vb.rz + vc.rz) / 3,
            fill: `rgb(${Math.min(244, shadeR)}, ${Math.min(244, shadeG)}, ${Math.min(240, shadeB)})`,
            stroke: `rgba(244, 244, 240, ${Math.min(0.6, edgeAlpha).toFixed(3)})`,
          });
        }

        // Painter's algorithm: farthest Z first
        faceList.sort((f1, f2) => f1.avgZ - f2.avgZ);

        for (let i = 0; i < faceList.length; i++) {
          const f = faceList[i];
          const pa = projected[f.a];
          const pb = projected[f.b];
          const pc = projected[f.c];

          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.lineTo(pc.sx, pc.sy);
          ctx.closePath();
          ctx.fillStyle = f.fill;
          ctx.fill();
          ctx.strokeStyle = f.stroke;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      } else if (renderMode === "wireframe") {
        const edgeList: EdgeDrawItem[] = new Array(mesh.edges.length);
        for (let i = 0; i < mesh.edges.length; i++) {
          const [a, b] = mesh.edges[i];
          edgeList[i] = {
            a,
            b,
            avgZ: (projected[a].rz + projected[b].rz) * 0.5,
          };
        }
        edgeList.sort((e1, e2) => e1.avgZ - e2.avgZ);

        ctx.lineWidth = 0.9;
        for (let i = 0; i < edgeList.length; i++) {
          const { a, b, avgZ } = edgeList[i];
          const pa = projected[a];
          const pb = projected[b];
          const depthAlpha = Math.max(0.1, Math.min(0.84, (avgZ + 1.2) / 2.2));
          ctx.strokeStyle = `rgba(244, 244, 240, ${depthAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      } else {
        // Vertex point-cloud mode with ghost structural edges & coordinate ticks
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 0.6;
        for (let i = 0; i < mesh.edges.length; i++) {
          const [a, b] = mesh.edges[i];
          const pa = projected[a];
          const pb = projected[b];
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }

        const sortedVerts = projected
          .map((p, index) => ({ p, index }))
          .sort((v1, v2) => v1.p.rz - v2.p.rz);

        for (let i = 0; i < sortedVerts.length; i++) {
          const { p, index } = sortedVerts[i];
          const depthFactor = Math.max(0.2, Math.min(1, (p.rz + 1.2) / 2.3));
          const pointRadius = 1.2 + depthFactor * 1.6;
          ctx.fillStyle = `rgba(244, 244, 240, ${(0.25 + depthFactor * 0.72).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, pointRadius, 0, Math.PI * 2);
          ctx.fill();

          if (index % 14 === 0 && depthFactor > 0.55) {
            ctx.strokeStyle = "rgba(244, 244, 240, 0.48)";
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.sx - 5, p.sy);
            ctx.lineTo(p.sx + 5, p.sy);
            ctx.moveTo(p.sx, p.sy - 5);
            ctx.lineTo(p.sx, p.sy + 5);
            ctx.stroke();
          }
        }
      }

      if (typeof requestAnimationFrame === "function") {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    if (typeof requestAnimationFrame === "function") {
      rafId = requestAnimationFrame(drawFrame);
    } else {
      drawFrame(lastTimestamp + 16);
    }

    return () => {
      isDisposed = true;
      if (rafId !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafId);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", syncCanvasSize);
      }
      resizeObserver?.disconnect();
    };
  }, [mesh, renderMode, scrollWeight]);

  const triggerBump = () => {
    const phys = physicsRef.current;
    phys.bumpScale = 1.28;
    phys.bumpVelocity = 0.35;
    phys.radialPulse = 1.0;
    phys.shockwaveRadius = 0.04;
    phys.shockwaveAlpha = 1.0;

    const nextCount = bumpCountRef.current + 1;
    bumpCountRef.current = nextCount;
    setBumpCount(nextCount);
    onBumpRef.current?.(nextCount);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveOrbit) return;
    dragStateRef.current = {
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
      totalDist: 0,
      wasLongDrag: false,
    };
    if (typeof e.currentTarget.setPointerCapture === "function" && e.pointerId !== undefined) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore synthetic test events without active pointerId
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!interactiveOrbit || !drag.isDragging) return;

    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.totalDist += Math.hypot(dx, dy);

    if (drag.totalDist > 8) {
      drag.wasLongDrag = true;
    }

    physicsRef.current.dragRotY += dx * 0.009;
    physicsRef.current.dragRotX += dy * 0.009;
    physicsRef.current.orbitVelY = dx * 0.009;
    physicsRef.current.orbitVelX = dy * 0.009;
  };

  const handlePointerEnd = () => {
    dragStateRef.current.isDragging = false;
  };

  const handleClick = () => {
    if (dragStateRef.current.wasLongDrag) {
      dragStateRef.current.wasLongDrag = false;
      return;
    }
    triggerBump();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerBump();
    }
  };

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;
  const stageLabel = label || `Interactive 3D ${preset} viewport`;

  return (
    <div
      ref={stageRef}
      data-testid="interactive-3d-stage"
      data-cursor="BUMP / DRAG"
      data-preset={preset}
      data-render-mode={renderMode}
      data-bump-count={String(bumpCount)}
      role="region"
      aria-label={stageLabel}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: resolvedHeight,
        minHeight: "260px",
        backgroundColor: "transparent",
        border: "none",
        overflow: "hidden",
        userSelect: "none",
        touchAction: interactiveOrbit ? "none" : "auto",
        cursor: "pointer",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

export default Interactive3DCanvas;
