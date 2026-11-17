import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders Centra squeeze heading, 3 background editorial frames, overlapping vertical depth layers, and triggers callbacks", () => {
        const handleContact = vi.fn();
        render(<HeroSection onContactOpen={handleContact} />);

        // Squeeze Header
        expect(screen.getByTestId("hero-squeeze-runway")).toBeInTheDocument();
        expect(screen.getByTestId("hero-squeeze-wrapper")).toBeInTheDocument();

        const heading = screen.getByTestId("hero-squeeze-heading");
        expect(heading).toHaveTextContent("Angelo Justine D. Kamachi");
        expect(heading).toHaveStyle({
            transformOrigin: "50% 0%",
            mixBlendMode: "difference",
        });

        // Eyebrow & massive statement
        expect(screen.getByText("Full-Stack Software Engineer")).toBeInTheDocument();

        // Tall vertical parallax canvas & 3 background frames
        expect(screen.getByTestId("hero-perspective-stage")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-1")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-2")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-3")).toBeInTheDocument();
        expect(screen.getByAltText("Angelo Justine D. Kamachi portrait")).toBeInTheDocument();

        // Vertical-only architectural panels & difference lens
        expect(screen.getByTestId("hero-parallax-panel-top")).toBeInTheDocument();
        expect(screen.getByTestId("hero-parallax-panel-bottom")).toBeInTheDocument();
        expect(screen.getByTestId("hero-perspective-foreground")).toBeInTheDocument();

        const invertShape = screen.getByTestId("hero-parallax-invert-shape");
        expect(invertShape).toHaveStyle({ mixBlendMode: "difference" });

        // Overlapping vertical foreground depth items
        expect(screen.getByTestId("hero-perspective-subject")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-2")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-3")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-4")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-5")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-6")).toBeInTheDocument();

        // Actions
        const contactBtn = screen.getByRole("button", { name: "Get in Touch" });
        fireEvent.click(contactBtn);
        expect(handleContact).toHaveBeenCalledTimes(1);

        const worksLink = screen.getByRole("link", { name: /Explore Works/i });
        expect(worksLink).toHaveAttribute("href", "#featured");
    });
});
