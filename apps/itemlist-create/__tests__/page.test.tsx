import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import CreatePage from "../app/page";

describe("Create App Page", () => {
  it("renders Create calculator with title", () => {
    render(<CreatePage />);
    expect(screen.getByText("Create Calculator")).toBeInTheDocument();
  });
});
