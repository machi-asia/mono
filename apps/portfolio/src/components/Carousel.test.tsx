import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Carousel from "./Carousel";

describe("Carousel", () => {
  it("renders carousel items and navigates with buttons", () => {
    render(
      <Carousel>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Carousel>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);
  });
});
