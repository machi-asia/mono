import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StarRating from "./StarRating";

describe("StarRating", () => {
  it("renders display star rating", () => {
    const { container } = render(<StarRating variant="display" rating={4} />);
    expect(container.querySelector(".star-rating--display")).toBeInTheDocument();
  });

  it("handles interactive rating change", () => {
    const handleRatingChange = vi.fn();
    const { container } = render(
      <StarRating variant="interactive" rating={3} onRatingChange={handleRatingChange} />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(5);
    fireEvent.click(buttons[4]); // 5th star
    expect(handleRatingChange).toHaveBeenCalledWith(5);
  });
});
