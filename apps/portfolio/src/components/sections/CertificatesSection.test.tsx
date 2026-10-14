import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CertificatesSection from "./CertificatesSection";
import { certificatesData } from "../../data/certificates";

describe("CertificatesSection", () => {
  it("renders certificates catalog and filters", () => {
    render(
      <CertificatesSection
        certificates={certificatesData}
      />
    );
    expect(screen.getByRole("heading", { name: /My Certificates/i })).toBeInTheDocument();
  });
});
