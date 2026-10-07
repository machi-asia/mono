import { describe, it, expect } from "vitest";
import {
  getCompressionTierSizeKB,
  compressImageFile,
} from "./image-compressor";

describe("Image Compressor", () => {
  it("determines correct size limits for each user tier", () => {
    expect(getCompressionTierSizeKB("guest")).toBe(2);
    expect(getCompressionTierSizeKB("member")).toBe(20);
    expect(getCompressionTierSizeKB("authenticated")).toBe(20);
    expect(getCompressionTierSizeKB("pro")).toBe(10 * 1024);
    expect(getCompressionTierSizeKB("admin")).toBe(Infinity);
  });

  it("bypasses non-image files and returns original file", async () => {
    const pdfFile = new File(["pdf content"], "doc.pdf", { type: "application/pdf" });
    const result = await compressImageFile(pdfFile, "guest");
    expect(result).toBe(pdfFile);
  });

  it("bypasses admin uploads without compression", async () => {
    const largeImage = new File([new Uint8Array(2 * 1024 * 1024)], "photo.jpg", {
      type: "image/jpeg",
    });
    const result = await compressImageFile(largeImage, "admin");
    expect(result).toBe(largeImage);
  });

  it("bypasses images that are already below tier limit", async () => {
    const tinyImage = new File([new Uint8Array(1 * 1024)], "tiny.png", {
      type: "image/png",
    });
    const result = await compressImageFile(tinyImage, "guest");
    expect(result).toBe(tinyImage);
  });
});
