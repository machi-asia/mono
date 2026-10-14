import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import RimWorldPage from "../app/page";

describe("RimWorld App Page", () => {
  it("renders RimWorld calculator with title", () => {
    render(<RimWorldPage />);
    expect(screen.getByText("RimWorld Calculator")).toBeInTheDocument();
    expect(screen.getByText("Under Development")).toBeInTheDocument();
  });
});
