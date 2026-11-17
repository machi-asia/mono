import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Footer from "./Footer";
import { profile } from "../../data/profile";

describe("Footer", () => {
    beforeEach(() => {
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    afterEach(() => {
        cleanup();
    });

    it("renders borderless footer with contact button and triggers callback", () => {
        const handleContact = vi.fn();
        render(<Footer onContactOpen={handleContact} />);
        expect(screen.getByText("Let's Work Together")).toBeInTheDocument();
        const btn = screen.getByRole("button", { name: "Start a Conversation" });
        fireEvent.click(btn);
        expect(handleContact).toHaveBeenCalledTimes(1);
    });

    it("renders social links cleanly", () => {
        render(<Footer onContactOpen={vi.fn()} />);

        expect(screen.getByRole("link", { name: "GitHub Profile" })).toHaveAttribute("href", profile.socials.github);
        expect(screen.getByRole("link", { name: "LinkedIn Profile" })).toHaveAttribute("href", profile.socials.linkedin);
        expect(screen.getByRole("link", { name: "Direct Email" })).toHaveAttribute(
            "href",
            `mailto:${profile.email.professional}`
        );
    });

    it("copies email address on one-click copy button and displays Copied feedback", async () => {
        render(<Footer onContactOpen={vi.fn()} />);

        const copyBtn = screen.getByRole("button", { name: `Copy email ${profile.email.professional}` });
        expect(copyBtn).toHaveTextContent(profile.email.professional);

        fireEvent.click(copyBtn);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(profile.email.professional);
            expect(copyBtn).toHaveTextContent("Copied");
        });
    });
});
