import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
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
    expect(screen.getByLabelText("Preview of Report.pdf")).toBeInTheDocument();
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

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const urlInput = within(dialog).getByRole("textbox");
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

  it("renders upload button and triggers onUpload callback", async () => {
    const handleUpload = vi.fn();
    render(<MediaLibrary items={mockItems} onUpload={handleUpload} />);

    const input = screen.getByLabelText("Upload files input") as HTMLInputElement;
    const testFile = new File(["test content"], "document.pdf", { type: "application/pdf" });

    fireEvent.change(input, { target: { files: [testFile] } });
    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalled();
    });
  });

  it("supports renaming an item and calls onRename", async () => {
    const handleRename = vi.fn().mockResolvedValue(undefined);
    render(<MediaLibrary items={mockItems} onRename={handleRename} />);

    fireEvent.click(screen.getByText("Report.pdf"));
    const renameTrigger = screen.getByRole("button", { name: /rename file/i });
    fireEvent.click(renameTrigger);

    const renameInput = screen.getByLabelText("Rename media item");
    fireEvent.change(renameInput, { target: { value: "Updated-Report.pdf" } });

    const saveBtn = screen.getByRole("button", { name: /save name/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(handleRename).toHaveBeenCalledWith(mockItems[1], "Updated-Report.pdf");
    });
  });

  it("switches to list mode and renders compact row layout", () => {
    const handleViewModeChange = vi.fn();
    render(<MediaLibrary items={mockItems} onViewModeChange={handleViewModeChange} />);

    const listModeBtn = screen.getByRole("button", { name: /list mode/i });
    fireEvent.click(listModeBtn);

    expect(handleViewModeChange).toHaveBeenCalledWith("list");
    expect(screen.getByRole("list", { name: "Media list" })).toBeInTheDocument();
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();
  });

  it("filters items using fuzzy search input", () => {
    render(<MediaLibrary items={mockItems} />);

    const searchInput = screen.getByLabelText("Search media files");
    fireEvent.change(searchInput, { target: { value: "rep" } });

    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.queryByText("Photo 1.jpg")).not.toBeInTheDocument();
    expect(screen.queryByText("Spec.docx")).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    fireEvent.click(clearBtn);

    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();
    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.getByText("Spec.docx")).toBeInTheDocument();
  });

  it("renders popup variant trigger button and opens dialog when clicked", () => {
    const handleSelect = vi.fn();
    render(
      <MediaLibrary
        variant="popup"
        items={mockItems}
        triggerLabel="Choose Picture"
        modalTitle="Choose a Photo"
        onSelect={handleSelect}
      />
    );

    const triggerBtn = screen.getByRole("button", { name: "Choose Picture" });
    expect(triggerBtn).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Choose a Photo" })).not.toBeInTheDocument();

    // Click trigger to open popup
    fireEvent.click(triggerBtn);

    const popupDialog = screen.getByRole("dialog", { name: "Choose a Photo" });
    expect(popupDialog).toBeInTheDocument();
    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();

    // Select an item in popup: invokes callback and closes popup
    fireEvent.click(screen.getByText("Photo 1.jpg"));
    expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
    expect(screen.queryByRole("dialog", { name: "Choose a Photo" })).not.toBeInTheDocument();
  });

  it("restricts items and tabs according to allowedTypes in popup mode", () => {
    render(
      <MediaLibrary
        variant="popup"
        isOpen={true}
        items={mockItems}
        allowedTypes={["image"]}
      />
    );

    expect(screen.getByText("Photo 1.jpg")).toBeInTheDocument();
    expect(screen.getByText("Photo 2.png")).toBeInTheDocument();
    expect(screen.queryByText("Report.pdf")).not.toBeInTheDocument();
    expect(screen.queryByText("Spec.docx")).not.toBeInTheDocument();
  });

  it("renders role badge and storage usage bar with role limits", () => {
    render(
      <MediaLibrary
        items={mockItems}
        role="member"
      />
    );

    expect(screen.getByText("MEMBER")).toBeInTheDocument();
    expect(screen.getByText("Storage Usage")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /storage usage/i })).toBeInTheDocument();
  });

  it("renders unlimited storage state for admin role", () => {
    render(
      <MediaLibrary
        items={mockItems}
        role="admin"
      />
    );

    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.getByText(/Unlimited Cloud Storage/i)).toBeInTheDocument();
  });
});
