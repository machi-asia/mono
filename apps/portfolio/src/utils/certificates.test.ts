import { describe, it, expect } from "vitest";
import { formatPhysicalName, buildCertificateLink, buildMarkdownLink } from "./certificates";

describe("certificates utils", () => {
  it("formats physical certificate file name into title", () => {
    expect(formatPhysicalName("award-of-excellence")).toBe("Award Of Excellence");
  });

  it("builds correct verification link based on source", () => {
    const googleLink = buildCertificateLink("google", "123");
    expect(googleLink).toContain("skills.google.com");

    const courseraLink = buildCertificateLink("coursera", "abc");
    expect(courseraLink).toContain("coursera.org/share/abc");

    const wadhwaniLink = buildCertificateLink("wadhwani", "xyz");
    expect(wadhwaniLink).toContain("certificateId=xyz");
  });

  it("builds markdown badge link", () => {
    const md = buildMarkdownLink("Cert", "/img.webp", "https://verify.com");
    expect(md).toBe("[![Cert](/img.webp)](https://verify.com)");
  });
});
