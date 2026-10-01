import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./navbar";

const links = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about" },
];

describe("Navbar", () => {
  it("renders brand text", () => {
    render(<Navbar brand={<span>MyApp</span>} />);
    expect(screen.getByText("MyApp")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navbar links={links} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });

  it("applies active class to active link", () => {
    render(<Navbar links={links} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("m-navbar-link--active");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveClass("m-navbar-link--active");
  });

  it("renders actions slot", () => {
    render(<Navbar actions={<button type="button">Sign in</button>} />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("does not render auth menu when auth prop is absent", () => {
    render(<Navbar />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("falls back to U in the avatar when the name is empty or whitespace", () => {
    render(<Navbar auth={{ name: "   " }} />);
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("renders auth trigger with avatar fallback initials", () => {
    render(<Navbar auth={{ name: "Jane Doe" }} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders auth trigger with avatar image", () => {
    render(<Navbar auth={{ name: "Jane", avatar: "/avatar.png" }} />);
    expect(screen.getByRole("img", { name: "Jane" })).toHaveAttribute("src", "/avatar.png");
  });

  it("opens the dropdown menu on click", () => {
    render(<Navbar auth={{ name: "Jane" }} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("calls onSignOut when sign out is clicked", () => {
    const handleSignOut = vi.fn();
    render(<Navbar auth={{ name: "Jane", onSignOut: handleSignOut }} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Sign out"));
    expect(handleSignOut).toHaveBeenCalledTimes(1);
  });

  it("renders tabs variant with button links and handles tab switching", () => {
    const handleTabClick = vi.fn();
    render(
      <Navbar
        variant="tabs"
        links={[
          { label: "Tab 1", active: true, onClick: handleTabClick },
          { label: "Tab 2", onClick: handleTabClick },
        ]}
      />
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveClass("m-navbar-link--active");

    fireEvent.click(tabs[1]);
    expect(handleTabClick).toHaveBeenCalledTimes(1);
  });

  it("renders floating variant with appropriate classes", () => {
    const { container } = render(
      <Navbar variant="floating" brand={<span>Floating Brand</span>} links={links} />
    );
    expect(container.querySelector(".m-navbar--floating")).toBeInTheDocument();
  });

  it("renders account switcher and triggers switch and add account callbacks", () => {
    const handleSwitch = vi.fn();
    const handleAdd = vi.fn();
    render(
      <Navbar
        auth={{
          name: "Alice",
          email: "alice@example.com",
          accounts: [
            { id: "1", name: "Alice", email: "alice@example.com", active: true },
            { id: "2", name: "Bob", email: "bob@example.com" },
          ],
          onSwitchAccount: handleSwitch,
          onAddAccount: handleAdd,
        }}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Switch Account")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();

    // Click Bob's account
    fireEvent.click(screen.getByText("Bob"));
    expect(handleSwitch).toHaveBeenCalledWith("2");

    // Click add another account
    fireEvent.click(screen.getByText("Add another account"));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
