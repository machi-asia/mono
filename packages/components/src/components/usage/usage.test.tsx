import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Usage } from "./usage";

describe("Usage", () => {
  it("renders label, numbers, and percentage", () => {
    render(<Usage label="Storage" used={45} total={100} unit="GB" />);
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText(/100 GB/)).toBeInTheDocument();
    expect(screen.getByText("(45%)")).toBeInTheDocument();
  });

  it("applies normal status styling when below thresholds", () => {
    const { container } = render(<Usage label="Bandwidth" used={20} total={100} />);
    expect(container.firstChild).toHaveClass("m-usage--normal");
  });

  it("applies warning status when crossing warning threshold", () => {
    const { container } = render(
      <Usage label="API Calls" used={80} total={100} warningThreshold={75} dangerThreshold={90} />
    );
    expect(container.firstChild).toHaveClass("m-usage--warning");
  });

  it("applies danger status when crossing danger threshold", () => {
    const { container } = render(
      <Usage label="Database Rows" used={95} total={100} warningThreshold={75} dangerThreshold={90} />
    );
    expect(container.firstChild).toHaveClass("m-usage--danger");
  });

  it("applies exceeded status and caps progress bar at 100% width when used > total", () => {
    const { container } = render(<Usage label="Credits" used={120} total={100} />);
    expect(container.firstChild).toHaveClass("m-usage--exceeded");
    const fill = container.querySelector(".m-usage-fill") as HTMLElement;
    expect(fill.style.width).toBe("100%");
  });

  it("renders custom description and hides percentage when configured", () => {
    render(
      <Usage
        label="Monthly Active Users"
        used={500}
        total={1000}
        showPercentage={false}
        description="Plan renews on the 1st of every month."
      />
    );
    expect(screen.getByText("Plan renews on the 1st of every month.")).toBeInTheDocument();
    expect(screen.queryByText("(50%)")).not.toBeInTheDocument();
  });

  it("sets accessible progressbar role and aria attributes", () => {
    render(<Usage label="Compute" used={3} total={10} unit="hours" />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "3");
    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "10");
  });
});
