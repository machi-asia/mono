import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import AboutSection from "./AboutSection";
import { certificatesData } from "../../data/certificates";
import { workCompanies, educationHistory } from "../../data/experience";

describe("AboutSection", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders about heading and profile details", () => {
        render(<AboutSection />);
        expect(screen.getByRole("heading", { name: /About Me/i })).toBeInTheDocument();
        expect(screen.getByText(/Full Stack Developer/i)).toBeInTheDocument();
    });

    it("renders scroll-scrubbed manifesto tokens and borderless stats", () => {
        render(
            <AboutSection
                repos={[]}
                certificates={certificatesData}
                workCompanies={workCompanies}
                education={educationHistory}
            />
        );

        const words = screen.getAllByTestId("manifesto-word");
        expect(words.length).toBeGreaterThan(15);

        expect(screen.getByTestId("about-parallax-panel")).toBeInTheDocument();
        expect(screen.getByTestId("about-parallax-invert-shape")).toHaveStyle({
            mixBlendMode: "difference",
        });

        expect(screen.getByText("Experience")).toBeInTheDocument();
        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(screen.getByText("Certificates")).toBeInTheDocument();
    });

    it("renders education timeline and opens diploma modal on thumbnail click", () => {
        render(
            <AboutSection
                repos={[]}
                certificates={certificatesData}
                workCompanies={workCompanies}
                education={educationHistory}
            />
        );

        expect(screen.getByText("B.S. Computer Science")).toBeInTheDocument();
        expect(screen.getByText("Senior High School")).toBeInTheDocument();

        const diplomaBtn = screen.getByRole("button", { name: /View Senior High School diploma 1/i });
        fireEvent.click(diplomaBtn);

        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveTextContent("Senior High School");
        expect(dialog).toHaveTextContent("Mapua Malayan Colleges Laguna");
    });
});
