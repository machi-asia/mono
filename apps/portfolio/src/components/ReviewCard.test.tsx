import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReviewCard from "./ReviewCard";
import type { VisitorReview } from "../data/types";

describe("ReviewCard", () => {
  const mockReview: VisitorReview = {
    id: 1,
    user_id: "user-1",
    user_name: "John Doe",
    user_avatar: "/icons/logo.svg",
    rating: 5,
    comment: "Excellent design and engineering!",
    created_at: "2024-01-01T00:00:00Z",
  };

  it("renders reviewer name, comment, and rating", () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Excellent design and engineering!")).toBeInTheDocument();
  });

  it("allows editing when isOwnerOrAdmin is true", () => {
    const handleEdit = vi.fn();
    render(<ReviewCard review={mockReview} isOwnerOrAdmin onEdit={handleEdit} />);
    const editBtn = screen.getByRole("button", { name: /edit review/i });
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalled();
  });
});
