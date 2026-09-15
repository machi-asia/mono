import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CalculatorPage from "../app/page";
import { MockAuthProvider } from "@mono/auth/mock";

afterEach(() => {
  cleanup();
});

describe("CalculatorPage", () => {
  it("renders the calculator header and default game items", () => {
    render(
      <MockAuthProvider state="signed-in">
        <CalculatorPage />
      </MockAuthProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /Game Production Calculator/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Boardwalk Plank")).toBeInTheDocument();
    expect(screen.getByText("Roof Tile")).toBeInTheDocument();
  });

  it("filters items using the search input", () => {
    render(
      <MockAuthProvider state="signed-in">
        <CalculatorPage />
      </MockAuthProvider>
    );

    const searchInput = screen.getByRole("textbox", { name: /filter items/i });
    fireEvent.change(searchInput, { target: { value: "Roof Tile" } });

    expect(screen.getByText("Roof Tile")).toBeInTheDocument();
    expect(screen.queryByText("Boardwalk Plank")).not.toBeInTheDocument();
  });

  it("opens item recipe popup when clicking View Recipe", () => {
    render(
      <MockAuthProvider state="signed-in">
        <CalculatorPage />
      </MockAuthProvider>
    );

    const viewButtons = screen.getAllByRole("button", { name: /View Recipe/i });
    fireEvent.click(viewButtons[0]);

    expect(screen.getByText(/Building Required/i)).toBeInTheDocument();
    expect(screen.getByText(/Processing Time/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Assembler/i).length).toBeGreaterThan(0);
  });

  it("switches to recipe tree graph view and shows production targets panel", () => {
    render(
      <MockAuthProvider state="signed-in">
        <CalculatorPage />
      </MockAuthProvider>
    );

    const graphTab = screen.getByRole("button", { name: /Recipe Tree Graph/i });
    fireEvent.click(graphTab);

    expect(screen.getByText("Production Targets")).toBeInTheDocument();
    expect(screen.getByText(/Machine Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Catalog/i)).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /Back to Catalog/i });
    fireEvent.click(backButton);

    expect(screen.getByText("Boardwalk Plank")).toBeInTheDocument();
  });

  it("navigates to graph view when clicking Graph button on an item card", () => {
    render(
      <MockAuthProvider state="signed-in">
        <CalculatorPage />
      </MockAuthProvider>
    );

    const graphButtons = screen.getAllByRole("button", { name: /^Graph$/i });
    fireEvent.click(graphButtons[0]);

    expect(screen.getByText("Production Targets")).toBeInTheDocument();
  });
});
