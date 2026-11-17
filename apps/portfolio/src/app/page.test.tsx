import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MockAuthProvider } from "@mono/auth/mock";
import PortfolioPage from "./page";

describe("PortfolioPage", () => {
  it(
    "renders borderless portfolio without Showreel and with parallax reveal panels",
    () => {
      const { container } = render(
        <MockAuthProvider state="signed-out">
          <PortfolioPage />
        </MockAuthProvider>
      );

      // Navbar & global motion primitives
      expect(container.querySelector('[data-mono="navbar"]')).toBeInTheDocument();
      expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
      expect(screen.getByTestId("scroll-progress-rail")).toBeInTheDocument();

      // Showreel removed
      expect(container.querySelector("#showreel")).not.toBeInTheDocument();

      // Parallax & Reveal panels rendered between chapters
      expect(screen.getByTestId("reveal-hero-works")).toBeInTheDocument();
      expect(screen.getByTestId("reveal-works-about")).toBeInTheDocument();
      expect(screen.getByTestId("reveal-about-3d")).toBeInTheDocument();
      expect(screen.getByTestId("reveal-3d-experience")).toBeInTheDocument();
      expect(screen.getByTestId("reveal-projects-skills")).toBeInTheDocument();
      expect(screen.getByTestId("reveal-faq-footer")).toBeInTheDocument();

      // Rearranged sections in order
      const hero = container.querySelector("#hero");
      const featured = container.querySelector("#featured");
      const about = container.querySelector("#about");
      const showcase3d = container.querySelector('[id="3d-showcase"]');
      const experience = container.querySelector("#experience");
      const projects = container.querySelector("#projects");
      const skills = container.querySelector("#skills");
      const certificates = container.querySelector("#certificates");
      const visitors = container.querySelector("#visitors");
      const faq = container.querySelector("#faq");
      const contact = container.querySelector("#contact");

      expect(hero).toBeInTheDocument();
      expect(featured).toBeInTheDocument();
      expect(about).toBeInTheDocument();
      expect(showcase3d).toBeInTheDocument();
      expect(experience).toBeInTheDocument();
      expect(projects).toBeInTheDocument();
      expect(skills).toBeInTheDocument();
      expect(certificates).toBeInTheDocument();
      expect(visitors).toBeInTheDocument();
      expect(faq).toBeInTheDocument();
      expect(contact).toBeInTheDocument();

      // Verify rearranged DOM order
      expect(hero!.compareDocumentPosition(featured!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(featured!.compareDocumentPosition(about!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(about!.compareDocumentPosition(showcase3d!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(showcase3d!.compareDocumentPosition(experience!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(experience!.compareDocumentPosition(projects!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(projects!.compareDocumentPosition(skills!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(skills!.compareDocumentPosition(certificates!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

      // Key section headings & landmarks
      expect(screen.getAllByText("Angelo Justine D. Kamachi").length).toBeGreaterThan(0);
      expect(screen.getByRole("heading", { name: /3D Showcase/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Featured Works/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Work Experience/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /My Skills/i })).toBeInTheDocument();
      expect(screen.getByText(/Let's Work Together/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Start a Conversation/i })).toBeInTheDocument();
    },
    30000
  );
});
