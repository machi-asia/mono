import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MediaLibrary } from "./medialibrary";

const items = [
  { id: "1", url: "/img1.jpg", name: "Photo 1", type: "image" as const },
  { id: "2", url: "/vid1.mp4", name: "Video 1", type: "video" as const },
];

describe("MediaLibrary", () => {
  it("renders empty state when no items", () => {
    render(<MediaLibrary />);
    expect(screen.getByText("No media files yet.")).toBeInTheDocument();
  });

  it("renders media items", () => {
    render(<MediaLibrary items={items} />);
    expect(screen.getByText("Photo 1")).toBeInTheDocument();
    expect(screen.getByText("Video 1")).toBeInTheDocument();
  });

  it("calls onSelect when an item is clicked", () => {
    const handleSelect = vi.fn();
    render(<MediaLibrary items={items} onSelect={handleSelect} />);
    fireEvent.click(screen.getByText("Photo 1"));
    expect(handleSelect).toHaveBeenCalledWith(items[0]);
  });

  it("renders the upload button", () => {
    render(<MediaLibrary />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });

  it("selects an item visually", () => {
    render(<MediaLibrary items={items} />);
    fireEvent.click(screen.getByText("Photo 1"));
    const buttons = screen.getAllByRole("button");
    const itemButton = buttons.find((b) => b.textContent?.includes("Photo 1"));
    expect(itemButton).toHaveClass("m-media-item--selected");
  });
});
