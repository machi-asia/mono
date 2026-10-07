import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OtaUpdateNotifier } from "./OtaUpdateNotifier";

describe("OtaUpdateNotifier", () => {
  it("does not render when inactive on non-native platform", () => {
    const { container } = render(<OtaUpdateNotifier />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when forceShow is enabled", () => {
    render(<OtaUpdateNotifier forceShow mockProgress={65} mockStatus="Downloading updates..." />);
    
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Downloading updates...")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "65");
  });
});
