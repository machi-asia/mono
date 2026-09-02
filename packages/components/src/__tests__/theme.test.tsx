import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../theme";

vi.mock("next-themes", () => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="mock-theme-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <p>hello</p>
      </ThemeProvider>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("defaults to dark theme with class attribute and system support", () => {
    render(
      <ThemeProvider>
        <p>x</p>
      </ThemeProvider>
    );
    const provider = screen.getByTestId("mock-theme-provider");
    const props = JSON.parse(provider.getAttribute("data-props") as string);
    expect(props.defaultTheme).toBe("dark");
    expect(props.attribute).toBe("class");
    expect(props.enableSystem).toBe(true);
  });
});
