export type RenderMode3D = "shaded" | "wireframe" | "vertex";

export type GeometryPreset3D =
  | "torus-knot"
  | "icosahedron-core"
  | "octahedron-lattice"
  | "cyber-gyroid";

export interface Model3DAsset {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  preset: GeometryPreset3D;
  /** Optional external .glb / .gltf asset URL for drop-in model replacement. */
  modelUrl?: string;
  previewVideoUrl: string;
  previewImageUrl: string;
  specs: {
    vertices: string;
    faces: string;
    topology: string;
    engine: string;
  };
  defaultMode: RenderMode3D;
}

export interface ShowreelVideoAsset {
  id: string;
  index: string;
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
  span: "wide" | "tall" | "standard";
  tags: string[];
}

export interface Hero3DConfig {
  preset: GeometryPreset3D;
  /** Optional external .glb / .gltf asset URL for future mesh swap. */
  modelUrl?: string;
  renderMode: RenderMode3D;
  scrollRotationYFactor: number;
  scrollRotationXFactor: number;
  bumpScale: number;
  bumpImpulseSpeed: number;
}

export interface RenderStillAsset {
  id: string;
  label: string;
  imageUrl: string;
  modeLabel: string;
}

export const HERO_3D_CONFIG: Hero3DConfig = {
  preset: "torus-knot",
  // modelUrl: "/models/hero-torus-knot.glb",
  modelUrl: undefined,
  renderMode: "shaded",
  scrollRotationYFactor: 0.004,
  scrollRotationXFactor: 0.002,
  bumpScale: 1.28,
  bumpImpulseSpeed: 0.35,
};

export const MAIN_SHOWREEL: ShowreelVideoAsset = {
  id: "showreel-2026-master",
  index: "00",
  title: "Showreel 2026 — Systems & Motion",
  category: "MASTER REEL",
  duration: "01:24",
  videoUrl: "/videos/WebDev.mp4",
  posterUrl: "/images/preview.webp",
  description:
    "Compiled archive of interactive web architectures, real-time shaders, kinetic typography systems, and procedural 3D tooling.",
  span: "wide",
  tags: ["Framer Motion", "Next.js", "3D Pipeline"],
};

export const SHOWREEL_BENTO_VIDEOS: ShowreelVideoAsset[] = [
  {
    id: "reel-web-systems",
    index: "01",
    title: "Web Systems & Interface Choreography",
    category: "FULL-STACK MOTION",
    duration: "00:38",
    videoUrl: "/videos/WebDev.mp4",
    posterUrl: "/images/preview.webp",
    description:
      "Production Next.js platforms engineered with spring-physics micro-interactions, GPU-composited layout transitions, and deterministic state architecture.",
    span: "wide",
    tags: ["Next.js", "TypeScript", "Spring UI"],
  },
  {
    id: "reel-unity-physics",
    index: "02",
    title: "Real-Time Gameplay & Shader Physics",
    category: "INTERACTIVE ENGINE",
    duration: "00:46",
    videoUrl: "/videos/GameDev.mp4",
    posterUrl: "/images/standard-hero.webp",
    description:
      "Custom C# collision solvers, procedural kinematics, and HLSL shader graphs built for responsive multi-platform gameplay loops.",
    span: "tall",
    tags: ["Unity", "C#", "Shader Graph"],
  },
  {
    id: "reel-blender-lookdev",
    index: "03",
    title: "Hard-Surface Lookdev & Topology",
    category: "3D PIPELINE",
    duration: "00:52",
    videoUrl: "/videos/Blender.mp4",
    posterUrl: "/images/tilt-hero.webp",
    description:
      "Subdivision hard-surface assets, procedural PBR shading networks, and non-destructive Boolean study models baked for real-time viewports.",
    span: "standard",
    tags: ["Blender", "GLSL", "PBR"],
  },
  {
    id: "reel-concept-studies",
    index: "04",
    title: "Monochrome Silhouette & Form Studies",
    category: "VISUAL DIRECTION",
    duration: "00:29",
    videoUrl: "/videos/Drawings.mp4",
    posterUrl: "/images/standard-cut-hero.webp",
    description:
      "Lineweight composition studies, architectural framing sketches, and keyframe blocking translated into digital interface motifs.",
    span: "standard",
    tags: ["Concept Art", "Composition", "Motion"],
  },
];

export const SHOWCASE_3D_MODELS: Model3DAsset[] = [
  {
    id: "model-torus-knot",
    code: "MOD-01",
    title: "Trefoil Harmonic Knot",
    subtitle: "Continuous (2,3) Parametric Tube",
    description:
      "Closed-loop trefoil torus knot swept along a Frenet-Serret frame with obsidian metallic face shading and spring-driven radial impulse response.",
    preset: "torus-knot",
    // modelUrl: "/models/trefoil-harmonic.glb",
    modelUrl: undefined,
    previewVideoUrl: "/videos/Blender.mp4",
    previewImageUrl: "/images/preview.webp",
    specs: {
      vertices: "288",
      faces: "576",
      topology: "Quad-Split Triangulated Tube",
      engine: "Procedural Canvas2D / GLTF-Ready",
    },
    defaultMode: "shaded",
  },
  {
    id: "model-icosahedron-core",
    code: "MOD-02",
    title: "Geodesic Icosahedron Core",
    subtitle: "Dual-Shell Subdivided Polyhedron",
    description:
      "Frequency-2 subdivided icosahedron enclosing a counter-poised inner polyhedral kernel engineered for architectural lighting contrast.",
    preset: "icosahedron-core",
    // modelUrl: "/models/icosahedron-core.glb",
    modelUrl: undefined,
    previewVideoUrl: "/videos/WebDev.mp4",
    previewImageUrl: "/images/standard-hero.webp",
    specs: {
      vertices: "174",
      faces: "340",
      topology: "Geodesic Dual-Shell Manifold",
      engine: "Procedural Canvas2D / GLTF-Ready",
    },
    defaultMode: "wireframe",
  },
  {
    id: "model-octahedron-lattice",
    code: "MOD-03",
    title: "Octahedron Structural Lattice",
    subtitle: "Compound Truss & Cardinal Nodes",
    description:
      "Interlocking primary and rotated octahedra anchored by six cardinal vertex nodes, demonstrating crisp CAD wireframe symmetry.",
    preset: "octahedron-lattice",
    // modelUrl: "/models/octahedron-lattice.glb",
    modelUrl: undefined,
    previewVideoUrl: "/videos/GameDev.mp4",
    previewImageUrl: "/images/tilt-hero.webp",
    specs: {
      vertices: "60",
      faces: "88",
      topology: "Compound Polyhedral Lattice",
      engine: "Procedural Canvas2D / GLTF-Ready",
    },
    defaultMode: "wireframe",
  },
  {
    id: "model-cyber-gyroid",
    code: "MOD-04",
    title: "Cyber Gyroid Isosurface",
    subtitle: "Minimal-Surface Triply Periodic Mesh",
    description:
      "Implicit gyroidal minimal surface bounded by a spherical envelope and extracted via marching tetrahedra into organic saddle tunnels.",
    preset: "cyber-gyroid",
    // modelUrl: "/models/cyber-gyroid.glb",
    modelUrl: undefined,
    previewVideoUrl: "/videos/Drawings.mp4",
    previewImageUrl: "/images/standard-cut-hero.webp",
    specs: {
      vertices: "~420",
      faces: "~760",
      topology: "Marching-Tetrahedra Isosurface",
      engine: "Procedural Canvas2D / GLTF-Ready",
    },
    defaultMode: "vertex",
  },
];

export const RENDER_STILLS: RenderStillAsset[] = [
  {
    id: "still-01",
    label: "STILL 01 // OBSIDIAN PASS",
    imageUrl: "/images/preview.webp",
    modeLabel: "SHADED BEAUTY",
  },
  {
    id: "still-02",
    label: "STILL 02 // ORTHO PROFILE",
    imageUrl: "/images/standard-hero.webp",
    modeLabel: "RIM SPECULAR",
  },
  {
    id: "still-03",
    label: "STILL 03 // CANTED AXON",
    imageUrl: "/images/tilt-hero.webp",
    modeLabel: "WIRE OVERLAY",
  },
  {
    id: "still-04",
    label: "STILL 04 // SECTION CUT",
    imageUrl: "/images/standard-cut-hero.webp",
    modeLabel: "INVERT MATTE",
  },
];
