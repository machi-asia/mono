import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CinematicScrollShowcase from "./CinematicScrollShowcase";
import { featuredWorks } from "../../data/featured-works";

describe("CinematicScrollShowcase", () => {
    it("renders pinned brand title, featured works heading, and counter", () => {
        render(<CinematicScrollShowcase featuredWorks={featuredWorks} />);

        expect(screen.getByText("Angelo Kamachi")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /Featured Works/i })).toBeInTheDocument();
        expect(screen.getByText(/Feature Work/i)).toBeInTheDocument();
    });

    it("renders media cards for each featured work", () => {
        render(<CinematicScrollShowcase featuredWorks={featuredWorks} />);

        expect(screen.getAllByText("SAMS+").length).toBeGreaterThan(0);
        expect(screen.getAllByText("TerraPrice").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Unity Passion Projects").length).toBeGreaterThan(0);
    });

    it("opens inspection dialog when a media card is clicked", () => {
        render(<CinematicScrollShowcase featuredWorks={featuredWorks} />);

        const inspectButtons = screen.getAllByRole("button", { name: /Inspect/i });
        expect(inspectButtons.length).toBeGreaterThan(0);

        fireEvent.click(inspectButtons[0]);
        expect(screen.getByText("Inspect Source")).toBeInTheDocument();
    });
});
