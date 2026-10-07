import { describe, it, expect } from "vitest";
import { detectMediaType } from "../media";

describe("database media module", () => {
  it("correctly identifies image MIME types and extensions", () => {
    expect(detectMediaType({ name: "avatar.jpg", type: "image/jpeg" })).toBe("image");
    expect(detectMediaType({ name: "banner.png", type: "image/png" })).toBe("image");
    expect(detectMediaType({ name: "icon.webp", type: "image/webp" })).toBe("image");
    expect(detectMediaType({ name: "animation.gif", type: "image/gif" })).toBe("image");
  });

  it("correctly identifies PDF files", () => {
    expect(detectMediaType({ name: "document.pdf", type: "application/pdf" })).toBe("pdf");
    expect(detectMediaType({ name: "manual.pdf" })).toBe("pdf");
  });

  it("correctly identifies Word document files", () => {
    expect(
      detectMediaType({
        name: "document.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    ).toBe("docx");
    expect(detectMediaType({ name: "old.doc", type: "application/msword" })).toBe("docx");
  });

  it("defaults to generic file type for other formats", () => {
    expect(detectMediaType({ name: "archive.zip", type: "application/zip" })).toBe("file");
    expect(detectMediaType({ name: "binary.bin", type: "application/octet-stream" })).toBe("file");
  });
});
