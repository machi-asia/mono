import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ParticlesBackground from "./ParticlesBackground";

describe("ParticlesBackground", () => {
  it("renders canvas element without throwing", () => {
    const { container } = render(<ParticlesBackground />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});
