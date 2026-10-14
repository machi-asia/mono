import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FeaturedWorksSection from "./FeaturedWorksSection";
import { featuredWorks } from "../../data/featured-works";

describe("FeaturedWorksSection", () => {
  it("renders featured works section with project video cards", () => {
    render(
      <FeaturedWorksSection
        featuredWorks={featuredWorks}
      />
    );
    expect(screen.getByRole("heading", { name: /Featured Works/i })).toBeInTheDocument();
  });
});
