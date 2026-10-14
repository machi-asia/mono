import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MockAuthProvider } from "@mono/auth/mock";
import PortfolioPage from "./page";

describe("PortfolioPage", () => {
  it(
    "renders main portfolio sections",
    () => {
      const { container } = render(
        <MockAuthProvider state="signed-out">
          <PortfolioPage />
        </MockAuthProvider>
      );
      expect(container.querySelector('[data-mono="navbar"]')).toBeInTheDocument();
      expect(screen.getAllByText("Angelo Justine D. Kamachi").length).toBeGreaterThan(0);
      expect(screen.getByRole("heading", { name: /Featured Works/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Work Experience/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /My Skills/i })).toBeInTheDocument();
    },
    25000
  );
});
