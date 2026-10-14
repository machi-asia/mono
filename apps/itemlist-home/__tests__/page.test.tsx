import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

describe("Home Directory Page", () => {
  it("renders Directory Hub and Game Links", () => {
    render(<HomePage />);
    expect(screen.getByText("Select Your Game")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("RimWorld")).toBeInTheDocument();
    expect(screen.getByText("Under Development")).toBeInTheDocument();
  });
});
