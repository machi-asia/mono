import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutSection from "./AboutSection";

describe("AboutSection", () => {
  it("renders about heading and profile details", () => {
    render(<AboutSection />);
    expect(screen.getByRole("heading", { name: /About Me/i })).toBeInTheDocument();
    expect(screen.getByText(/Full Stack Developer/i)).toBeInTheDocument();
  });
});
