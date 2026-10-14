import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReportIssueModal } from "../report-issue-modal";
import type { GameDataset } from "../../types/data";

const mockDataset: GameDataset = {
  id: "test-game",
  name: "Test Game",
  tagline: "Test Game Tagline",
  items: [
    {
      id: "iron-gear",
      name: "Iron Gear",
      category: "Components",
      icon: "/items/gear.png",
      description: "A mechanical gear",
      recipes: [],
    },
    {
      id: "copper-wire",
      name: "Copper Wire",
      category: "Components",
      icon: "/items/wire.png",
      description: "Conductive wire",
      recipes: [],
    },
  ],
};

describe("ReportIssueModal", () => {
  it("renders when open and allows submitting an issue report", () => {
    const onOpenChange = vi.fn();
    render(
      <ReportIssueModal
        dataset={mockDataset}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByText("Report Recipe / Data Issue")).toBeInTheDocument();
    expect(screen.getByLabelText(/What is incorrect/i)).toBeInTheDocument();

    // Fill form
    const itemSelect = screen.getByLabelText(/Related Item \/ Machine/i);
    fireEvent.change(itemSelect, { target: { value: "iron-gear" } });

    const issueTypeSelect = screen.getByLabelText(/Issue Category/i);
    fireEvent.change(issueTypeSelect, { target: { value: "wrong_throughput" } });

    const descInput = screen.getByLabelText(/What is incorrect/i);
    fireEvent.change(descInput, { target: { value: "Throughput is 20/min instead of 40/min." } });

    const submitBtn = screen.getByRole("button", { name: /Submit Report/i });
    fireEvent.click(submitBtn);

    // Should display success message
    expect(screen.getByText("Report Submitted")).toBeInTheDocument();
  });
});
