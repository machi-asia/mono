import { describe, it, expect } from "vitest";
import {
  HERO_3D_CONFIG,
  MAIN_SHOWREEL,
  SHOWREEL_BENTO_VIDEOS,
  SHOWCASE_3D_MODELS,
  RENDER_STILLS,
  type GeometryPreset3D,
  type RenderMode3D,
} from "./showcase-media";

describe("showcase-media data contract", () => {
  it("exports valid HERO_3D_CONFIG defaults", () => {
    expect(HERO_3D_CONFIG).toEqual({
      preset: "torus-knot",
      modelUrl: undefined,
      renderMode: "shaded",
      scrollRotationYFactor: 0.004,
      scrollRotationXFactor: 0.002,
      bumpScale: 1.28,
      bumpImpulseSpeed: 0.35,
    });
  });

  it("exports MAIN_SHOWREEL with expected metadata and assets", () => {
    expect(MAIN_SHOWREEL).toMatchObject({
      index: "00",
      title: "Showreel 2026 — Systems & Motion",
      category: "MASTER REEL",
      duration: "01:24",
      videoUrl: "/videos/WebDev.mp4",
      posterUrl: "/images/preview.webp",
      span: "wide",
      tags: ["Framer Motion", "Next.js", "3D Pipeline"],
    });
  });

  it("exports 4 SHOWREEL_BENTO_VIDEOS mapped to expected videos and posters", () => {
    expect(SHOWREEL_BENTO_VIDEOS).toHaveLength(4);

    const videoUrls = SHOWREEL_BENTO_VIDEOS.map((item) => item.videoUrl);
    const posterUrls = SHOWREEL_BENTO_VIDEOS.map((item) => item.posterUrl);
    const ids = new Set(SHOWREEL_BENTO_VIDEOS.map((item) => item.id));

    expect(ids.size).toBe(4);
    expect(videoUrls).toEqual([
      "/videos/WebDev.mp4",
      "/videos/GameDev.mp4",
      "/videos/Blender.mp4",
      "/videos/Drawings.mp4",
    ]);
    expect(posterUrls).toEqual([
      "/images/preview.webp",
      "/images/standard-hero.webp",
      "/images/tilt-hero.webp",
      "/images/standard-cut-hero.webp",
    ]);

    for (const item of SHOWREEL_BENTO_VIDEOS) {
      expect(["wide", "tall", "standard"]).toContain(item.span);
      expect(item.tags.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(10);
    }
  });

  it("exports 4 SHOWCASE_3D_MODELS covering all geometry presets", () => {
    expect(SHOWCASE_3D_MODELS).toHaveLength(4);

    const expectedPresets: GeometryPreset3D[] = [
      "torus-knot",
      "icosahedron-core",
      "octahedron-lattice",
      "cyber-gyroid",
    ];
    const validModes: RenderMode3D[] = ["shaded", "wireframe", "vertex"];

    expect(SHOWCASE_3D_MODELS.map((m) => m.preset)).toEqual(expectedPresets);

    for (const model of SHOWCASE_3D_MODELS) {
      expect(validModes).toContain(model.defaultMode);
      expect(model).toHaveProperty("modelUrl");
      expect(model.specs.vertices.length).toBeGreaterThan(0);
      expect(model.specs.faces.length).toBeGreaterThan(0);
      expect(model.specs.topology.length).toBeGreaterThan(0);
      expect(model.specs.engine.length).toBeGreaterThan(0);
      expect(model.previewVideoUrl).toMatch(/^\/videos\/.+\.mp4$/);
      expect(model.previewImageUrl).toMatch(/^\/images\/.+\.webp$/);
    }
  });

  it("exports 4 RENDER_STILLS mapped to portfolio still images", () => {
    expect(RENDER_STILLS).toHaveLength(4);
    expect(RENDER_STILLS.map((still) => still.imageUrl)).toEqual([
      "/images/preview.webp",
      "/images/standard-hero.webp",
      "/images/tilt-hero.webp",
      "/images/standard-cut-hero.webp",
    ]);

    for (const still of RENDER_STILLS) {
      expect(still.id.length).toBeGreaterThan(0);
      expect(still.label.length).toBeGreaterThan(0);
      expect(still.modeLabel.length).toBeGreaterThan(0);
    }
  });
});
