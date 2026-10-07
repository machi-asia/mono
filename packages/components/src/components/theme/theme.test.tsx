import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme";

function TestConsumer() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children without injecting any <script> elements", () => {
    const { container } = render(
      <ThemeProvider>
        <p>hello world</p>
      </ThemeProvider>
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
    // Guarantee no script tags are injected inside the React tree
    expect(container.querySelectorAll("script").length).toBe(0);
  });

  it("defaults to dark theme and applies 'dark' class to documentElement", () => {
    render(
      <ThemeProvider defaultTheme="dark" attribute="class">
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("allows toggling theme via useTheme and persists to localStorage", () => {
    render(
      <ThemeProvider defaultTheme="dark" attribute="class">
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Set Light"));
    });

    expect(screen.getByTestId("current-theme").textContent).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("supports data-theme attribute", () => {
    render(
      <ThemeProvider defaultTheme="light" attribute="data-theme">
        <TestConsumer />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    act(() => {
      fireEvent.click(screen.getByText("Set Dark"));
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

