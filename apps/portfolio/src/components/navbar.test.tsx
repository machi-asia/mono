import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MockAuthProvider } from "@mono/auth/mock";
import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("renders floating navbar with links and sign in button when signed out", () => {
    const { container } = render(
      <MockAuthProvider state="signed-out">
        <Navbar />
      </MockAuthProvider>
    );

    expect(container.querySelector(".m-navbar--floating")).toBeInTheDocument();
    expect(container.querySelector('[data-mono="navbar"]')).toBeInTheDocument();
    expect(screen.getByText("AJDK")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "Certificates" })).toHaveAttribute("href", "#certificates");
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "#skills");
    expect(screen.getByRole("link", { name: "Works" })).toHaveAttribute("href", "#featured");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "#experience");
    expect(screen.getByRole("link", { name: "Reviews" })).toHaveAttribute("href", "#visitors");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "#faq");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders auth avatar and account trigger when signed in", () => {
    const { container } = render(
      <MockAuthProvider state="signed-in">
        <Navbar />
      </MockAuthProvider>
    );

    expect(container.querySelector(".m-navbar-auth")).toBeInTheDocument();
    expect(screen.getByText("demo@machi.asia")).toBeInTheDocument();
  });
});
