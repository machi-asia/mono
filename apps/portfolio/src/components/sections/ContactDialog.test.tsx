import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContactDialog from "./ContactDialog";

describe("ContactDialog", () => {
  it("renders contact dialog form when open", () => {
    const handleClose = vi.fn();
    render(<ContactDialog open={true} onOpenChange={handleClose} />);
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });
});
