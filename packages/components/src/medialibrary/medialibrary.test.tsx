import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MediaLibrary, type MediaItem } from "./medialibrary";

const mockItems: MediaItem[] = [
  { id: "1", url: "https://bucket.supabase.co/media/photo1.jpg", name: "Photo 1.jpg", type: "image", size: 102400 },
  { id: "2", url: "https://bucket.supabase.co/media/document.pdf", name: "Report.pdf", type: "pdf", size: 204800 },
  { id: "3", url: "https://bucket.supabase.co/media/spec.docx", name: "Spec.docx", type: "docx", size: 51200 },
  { id: "4", url: "https://bucket.supabase.co/media/photo2.png", name: "Photo 2.png", type: "image", size: 307200 },
];

describe("MediaLibrary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no items", () => {
    render(<MediaLibrary items={[]} />);
    expect(screen.getByText(/No media files found/i)).toBeInTheDocument();
  });

  it("renders media items with filter tabs", () => {
    render(<MediaLibrary items={mockItems} />);
    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();
    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.getByText("Spec.docx")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /images/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /pdfs/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /docx/i })).toBeInTheDocument();
  });

  it("filters items by PDF type when PDF tab is clicked", () => {
    render(<MediaLibrary items={mockItems} />);
    const pdfTab = screen.getByRole("tab", { name: /pdfs/i });
    fireEvent.click(pdfTab);

    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.queryByText("Photo 1.jpg")).not.toBeInTheDocument();
    expect(screen.queryByText("Spec.docx")).not.toBeInTheDocument();
  });

  it("filters items by DOCX type when DOCX tab is clicked", () => {
    render(<MediaLibrary items={mockItems} />);
    const docxTab = screen.getByRole("tab", { name: /docx/i });
    fireEvent.click(docxTab);

    expect(screen.getByText("Spec.docx")).toBeInTheDocument();
    expect(screen.queryByText("Photo 1.jpg")).not.toBeInTheDocument();
    expect(screen.queryByText("Report.pdf")).not.toBeInTheDocument();
  });

  it("filters items by image type when Images tab is clicked", () => {
    render(<MediaLibrary items={mockItems} />);
    const imageTab = screen.getByRole("tab", { name: /images/i });
    fireEvent.click(imageTab);

    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();
    expect(screen.getByText("Photo 2.png")).toBeInTheDocument();
    expect(screen.queryByText("Report.pdf")).not.toBeInTheDocument();
  });

  it("handles pagination navigation", () => {
    render(<MediaLibrary items={mockItems} pageSize={2} />);
    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();
    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.queryByText("Spec.docx")).not.toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /next page/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("Spec.docx")).toBeInTheDocument();
    expect(screen.getByText("Photo 2.png")).toBeInTheDocument();
    expect(screen.queryByText("Photo 1.jpg")).not.toBeInTheDocument();
  });

  it("opens modal on item click and displays public URL", () => {
    const handleSelect = vi.fn();
    render(<MediaLibrary items={mockItems} onSelect={handleSelect} />);

    fireEvent.click(screen.getByText("Report.pdf"));
    expect(handleSelect).toHaveBeenCalledWith(mockItems[1]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const urlInput = screen.getByRole("textbox");
    expect(urlInput).toHaveValue("https://bucket.supabase.co/media/document.pdf");
  });

  it("allows copying the public bucket URL from modal", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    render(<MediaLibrary items={mockItems} />);
    fireEvent.click(screen.getByText("Report.pdf"));

    const copyBtn = screen.getByRole("button", { name: /copy public link/i });
    fireEvent.click(copyBtn);

    expect(writeText).toHaveBeenCalledWith("https://bucket.supabase.co/media/document.pdf");
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("supports delete confirmation and calls onDelete", async () => {
    const handleDelete = vi.fn().mockResolvedValue(undefined);
    render(<MediaLibrary items={mockItems} onDelete={handleDelete} />);

    fireEvent.click(screen.getByText("Report.pdf"));
    const deleteBtn = screen.getByRole("button", { name: /delete media/i });

    // First click: prompts confirmation
    fireEvent.click(deleteBtn);
    expect(screen.getByText(/click to confirm delete/i)).toBeInTheDocument();
    expect(handleDelete).not.toHaveBeenCalled();

    // Second click: executes deletion
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledWith(mockItems[1]);
    });
  });

  it("renders upload button and triggers onUpload callback", () => {
    const handleUpload = vi.fn();
    render(<MediaLibrary items={mockItems} onUpload={handleUpload} />);

    const input = screen.getByLabelText("Upload files input") as HTMLInputElement;
    const testFile = new File(["test content"], "document.pdf", { type: "application/pdf" });

    fireEvent.change(input, { target: { files: [testFile] } });
    expect(handleUpload).toHaveBeenCalled();
  });
});
