import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TechStackParticles from "./TechStackParticles";

describe("TechStackParticles", () => {
  it("renders tech stack canvas", () => {
    const { container } = render(<TechStackParticles />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
