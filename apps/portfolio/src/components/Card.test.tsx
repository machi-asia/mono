import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Card from "./Card";

describe("Card", () => {
  it("renders card content and handles interactive state", () => {
    const { container } = render(
      <Card variant="interactive" className="custom-card">
        <h3>Card Title</h3>
      </Card>
    );
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(container.querySelector(".card-comp-interactive")).toBeInTheDocument();
    expect(container.querySelector(".custom-card")).toBeInTheDocument();
  });
});
