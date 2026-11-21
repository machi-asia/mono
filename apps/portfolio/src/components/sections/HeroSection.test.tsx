import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders Centra squeeze heading, 5 background editorial frames, 10 scattered vertical depth layers, and triggers callbacks", () => {
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

        // Animated Ink Splash on the right
        expect(screen.getByTestId("hero-ink-splash")).toBeInTheDocument();

        // Eyebrow & massive statement (invert-masked)
        const eyebrow = screen.getByTestId("hero-eyebrow");
        expect(eyebrow).toHaveTextContent("Full-Stack Software Engineer");
        expect(eyebrow).toHaveClass("invert-blend-text");
        expect(eyebrow).toHaveStyle({ mixBlendMode: "difference" });

        const statement = screen.getByTestId("hero-statement");
        expect(statement).toHaveClass("invert-blend-text");
        expect(statement).toHaveStyle({ mixBlendMode: "difference" });

        // Overlay statements (invert-masked)
        const overlayPrimary = screen.getByTestId("hero-overlay-statement-primary");
        expect(overlayPrimary).toHaveClass("invert-blend-text");
        expect(overlayPrimary).toHaveStyle({ mixBlendMode: "difference" });

        const overlaySecondary = screen.getByTestId("hero-overlay-statement-secondary");
        expect(overlaySecondary).toHaveClass("invert-blend-text");
        expect(overlaySecondary).toHaveStyle({ mixBlendMode: "difference" });

        // Tall vertical parallax canvas & 5 background frames
        expect(screen.getByTestId("hero-perspective-stage")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-1")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-2")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-3")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-4")).toBeInTheDocument();
        expect(screen.getByTestId("hero-bg-frame-5")).toBeInTheDocument();
        expect(screen.getByAltText("Angelo Justine D. Kamachi portrait")).toBeInTheDocument();

        // Vertical-only architectural panels & difference lens
        expect(screen.getByTestId("hero-parallax-panel-top")).toBeInTheDocument();
        expect(screen.getByTestId("hero-parallax-panel-bottom")).toBeInTheDocument();
        expect(screen.getByTestId("hero-perspective-foreground")).toBeInTheDocument();

        const invertShape = screen.getByTestId("hero-parallax-invert-shape");
        expect(invertShape).toHaveStyle({ mixBlendMode: "difference" });

        // Overlapping vertical foreground depth items scattered across the full stage
        expect(screen.getByTestId("hero-perspective-subject")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-2")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-3")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-4")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-5")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-6")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-7")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-8")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-9")).toBeInTheDocument();
        expect(screen.getByTestId("hero-depth-item-10")).toBeInTheDocument();

        // Actions
        const contactBtn = screen.getByRole("button", { name: "Get in Touch" });
        fireEvent.click(contactBtn);
        expect(handleContact).toHaveBeenCalledTimes(1);

        const worksLink = screen.getByRole("link", { name: /Explore Works/i });
        expect(worksLink).toHaveAttribute("href", "#featured");
    });
});
