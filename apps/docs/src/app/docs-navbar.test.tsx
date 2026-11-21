import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MockAuthProvider } from "@mono/auth/mock";
import { DocsNavbar } from "./docs-navbar";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs",
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("DocsNavbar", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders Machi Asia Docs brand and navigation links via AuthNavbar", () => {
    render(
      <MockAuthProvider state="signed-in">
        <DocsNavbar />
      </MockAuthProvider>
    );

    expect(screen.getByText("Machi Asia Docs")).toBeInTheDocument();
    expect(screen.getByText("Docs Wiki")).toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: /Framework/i });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Presentation")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Components"));
    expect(pushMock).toHaveBeenCalledWith("/components/components");
  });
});
