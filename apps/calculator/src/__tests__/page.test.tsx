import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { GameCalculatorView } from "../components/calculator-view/game-calculator-view";
import { MockAuthProvider } from "@mono/auth/mock";

afterEach(() => {
  cleanup();
});

describe("GameCalculatorView", () => {
  it("renders the calculator header and default game items", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="lrl" />
      </MockAuthProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Little Rocket Lab" })
    ).toBeInTheDocument();
    expect(screen.getByText("Boardwalk Plank")).toBeInTheDocument();
    expect(screen.getByText("Roof Tile")).toBeInTheDocument();
  });

  it("filters items using the search input", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="lrl" />
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
        <GameCalculatorView gameId="lrl" />
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
        <GameCalculatorView gameId="lrl" />
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
        <GameCalculatorView gameId="lrl" />
      </MockAuthProvider>
    );

    const graphButtons = screen.getAllByRole("button", { name: /^Graph$/i });
    fireEvent.click(graphButtons[0]);

    expect(screen.getByText("Production Targets")).toBeInTheDocument();
  });

  it("sorts items by name and category using caret controls", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="lrl" />
      </MockAuthProvider>
    );

    const firstItem = () =>
      screen.getAllByRole("heading", { level: 3 })[0].textContent;

    expect(firstItem()).toBe("Boardwalk Plank");

    const nameBtn = screen.getByRole("button", { name: /^Name$/i });
    const categoryBtn = screen.getByRole("button", { name: /^Category$/i });

    fireEvent.click(nameBtn); // Name asc
    expect(firstItem()).toBe("Amethyst");

    fireEvent.click(nameBtn); // Name desc
    expect(firstItem()).toBe("Wooden Chest");

    fireEvent.click(nameBtn); // off
    expect(firstItem()).toBe("Boardwalk Plank");

    fireEvent.click(categoryBtn); // Category asc
    expect(firstItem()).toBe("Assembler (Level 1)");

    fireEvent.click(categoryBtn); // Category desc
    expect(firstItem()).toBe("Boardwalk Plank");
  });

  it("shows the last updated date on item cards", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="lrl" />
      </MockAuthProvider>
    );

    expect(screen.getAllByText(/Updated Sep 15, 2026/i).length).toBeGreaterThan(0);
  });

  it("swaps between gallery and list view", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="lrl" />
      </MockAuthProvider>
    );

    const galleryBtn = screen.getByRole("button", { name: /^Gallery$/i });
    const listBtn = screen.getByRole("button", { name: /^List$/i });

    expect(galleryBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".calc-list")).toBeNull();
    expect(document.querySelectorAll(".calc-item-card").length).toBe(71);
    expect(document.querySelectorAll(".calc-item-row").length).toBe(0);

    fireEvent.click(listBtn);

    expect(listBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".calc-list")).not.toBeNull();
    expect(document.querySelectorAll(".calc-item-row").length).toBe(71);
    expect(document.querySelectorAll(".calc-item-card").length).toBe(0);

    fireEvent.click(galleryBtn);

    expect(galleryBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelectorAll(".calc-item-card").length).toBe(71);
    expect(document.querySelector(".calc-list")).toBeNull();
  });

  it("auto-colors item cards by category", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="lrl" />
      </MockAuthProvider>
    );

    const colors = Array.from(
      document.querySelectorAll<HTMLElement>(".calc-item-card")
    ).map((card) => card.style.getPropertyValue("--cat-color"));

    expect(colors.length).toBe(71);
    expect(new Set(colors).size).toBeGreaterThan(1);
    for (const color of colors) {
      expect(color).toMatch(/^hsl\(\d+ 55% 52%\)$/);
    }

    expect(screen.getAllByText("Boardwalk Plank")[0].closest(".calc-item-card"))
      .toHaveStyle("--cat-color: hsl(270 55% 52%)");
  });

  it("renders specific game items when gameId is provided", () => {
    render(
      <MockAuthProvider state="signed-in">
        <GameCalculatorView gameId="vfe-factory" />
      </MockAuthProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Vanilla Furniture Expanded - Factory" })).toBeInTheDocument();
    expect(screen.getByText("Mass-Produced Meal")).toBeInTheDocument();
    expect(screen.queryByText("Boardwalk Plank")).not.toBeInTheDocument();
  });
});

