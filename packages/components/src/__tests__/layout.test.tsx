import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Row, Col, Card } from "../layout";

describe("Row", () => {
  it("renders a flex row with a default gap", () => {
    render(
      <Row>
        <span>a</span>
      </Row>
    );
    const row = screen.getByText("a").parentElement;
    expect(row).toHaveAttribute("data-mono", "row");
    expect(row).toHaveStyle({ display: "flex", gap: "var(--space-4)" });
  });

  it("does not wrap by default and wraps when requested", () => {
    const { rerender } = render(<Row data-testid="row" />);
    expect(screen.getByTestId("row")).toHaveStyle({ flexWrap: undefined });
    rerender(<Row wrap data-testid="row" />);
    expect(screen.getByTestId("row")).toHaveStyle({ flexWrap: "wrap" });
  });

  it("applies align and justify", () => {
    render(<Row data-testid="row" align="center" justify="space-between" />);
    expect(screen.getByTestId("row")).toHaveStyle({
      alignItems: "center",
      justifyContent: "space-between",
    });
  });
});

describe("Col", () => {
  it("calculates width from span", () => {
    render(<Col span={6} data-testid="col" />);
    expect(screen.getByTestId("col")).toHaveStyle({ flex: "0 0 50%", maxWidth: "50%" });
  });

  it("applies offset as left margin", () => {
    render(<Col span={3} offset={3} data-testid="col" />);
    expect(screen.getByTestId("col")).toHaveStyle({ flex: "0 0 25%", marginLeft: "25%" });
  });

  it("fills available space when no span is given", () => {
    render(<Col data-testid="col" />);
    expect(screen.getByTestId("col")).toHaveStyle({ flex: "1 1 0", maxWidth: undefined });
  });
});

describe("Card", () => {
  it("renders a card surface with default styling", () => {
    render(<Card>content</Card>);
    const card = screen.getByText("content");
    expect(card).toHaveAttribute("data-mono", "card");
    expect(card.className).toContain("m-card-bordered");
    expect(card.className).toContain("m-card-padded");
  });

  it("honors elevated and non-bordered variants", () => {
    render(
      <Card elevated bordered={false} data-testid="card">
        x
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("m-card-elevated");
    expect(card.className).not.toContain("m-card-bordered");
  });
});
