import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentShowcase } from "./showcase";

describe("ComponentShowcase", () => {
  const props = {
    packageName: "test",
    description: "A test package.",
    components: [
      {
        name: "Alpha",
        description: "First component.",
        render: () => <p>Alpha live</p>,
      },
      {
        name: "Beta",
        uses: "import { Beta }",
        render: (values: Record<string, string>) => (
          <button type="button">Selected: {values.color}</button>
        ),
        propControls: [
          { prop: "color", label: "Color", options: ["red", "green"], defaultValue: "red" },
        ],
      },
    ],
  };

  it("renders the package name and description", () => {
    render(<ComponentShowcase {...props} />);
    expect(screen.getByRole("heading", { name: "@test" })).toBeInTheDocument();
    expect(screen.getByText("A test package.")).toBeInTheDocument();
  });

  it("renders each component name in the list", () => {
    render(<ComponentShowcase {...props} />);
    expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
  });

  it("renders the live output from render()", () => {
    render(<ComponentShowcase {...props} />);
    expect(screen.getByText("Alpha live")).toBeInTheDocument();
  });

  it("renders a dropdown per prop control with the default value applied", () => {
    render(<ComponentShowcase {...props} />);
    const select = screen.getByLabelText("Color") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("red");
    expect(screen.getByRole("button", { name: "Selected: red" })).toBeInTheDocument();
  });

  it("re-renders the live demo when a dropdown value changes", () => {
    render(<ComponentShowcase {...props} />);
    const select = screen.getByLabelText("Color");
    fireEvent.change(select, { target: { value: "green" } });
    expect(screen.getByRole("button", { name: "Selected: green" })).toBeInTheDocument();
  });

  it("does not render dropdown controls when none are provided", () => {
    const noControls = {
      packageName: "test",
      components: [
        {
          name: "Alpha",
          render: () => <p>Alpha live</p>,
        },
      ],
    };
    render(<ComponentShowcase {...noControls} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
