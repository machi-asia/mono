import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ShowreelSection from "./ShowreelSection";
import { MAIN_SHOWREEL } from "../../data/showcase-media";
import { featuredWorks } from "../../data/featured-works";

describe("ShowreelSection", () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        Object.defineProperty(HTMLMediaElement.prototype, "play", {
            configurable: true,
            value: vi.fn().mockResolvedValue(undefined),
        });
        Object.defineProperty(HTMLMediaElement.prototype, "pause", {
            configurable: true,
            value: vi.fn(),
        });
    });

    it("renders the borderless showreel header, master video, difference title, and embedded Featured Works", () => {
        render(<ShowreelSection featuredWorks={featuredWorks} />);

        expect(screen.getByRole("heading", { name: /Showreel/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /Featured Works/i })).toBeInTheDocument();

        const video = screen.getByTestId("showreel-video") as HTMLVideoElement;
        expect(video).toHaveAttribute("src", MAIN_SHOWREEL.videoUrl);
        expect(video).toHaveAttribute("poster", MAIN_SHOWREEL.posterUrl);
        expect(video.muted).toBe(true);

        expect(screen.getByTestId("showreel-kinetic-title")).toHaveStyle({ mixBlendMode: "difference" });
        expect(screen.getAllByText("SAMS+").length).toBeGreaterThan(0);
        expect(screen.getAllByText("TerraPrice").length).toBeGreaterThan(0);
    });

    it("toggles Play/Pause and Mute/Unmute controls cleanly", () => {
        render(<ShowreelSection featuredWorks={featuredWorks} />);

        const video = screen.getByTestId("showreel-video") as HTMLVideoElement;
        const playToggle = screen.getByRole("button", { name: /Pause showreel/i });
        expect(playToggle).toHaveAttribute("aria-pressed", "true");

        fireEvent.click(playToggle);
        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(screen.getByRole("button", { name: /Play showreel/i })).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(screen.getByRole("button", { name: /Play showreel/i }));
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

        const muteToggle = screen.getByRole("button", { name: /Unmute showreel/i });
        expect(video.muted).toBe(true);
        fireEvent.click(muteToggle);
        expect(video.muted).toBe(false);
        expect(screen.getByRole("button", { name: /Mute showreel/i })).toHaveAttribute("aria-pressed", "true");
    });
});
