import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MonoAppShell } from "./app-shell";

vi.mock("../../client", () => ({
  createClient: () => ({
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}));

describe("MonoAppShell", () => {
  it("renders header, children, and footer inside ThemeProvider, AuthProvider, and UsageProvider", () => {
    render(
      <MonoAppShell
        enableOta={false}
        disableUsageAutoFetch
        header={<header>Shell Header</header>}
        footer={<footer>Shell Footer</footer>}
      >
        <main>Modular App Content</main>
      </MonoAppShell>
    );

    expect(screen.getByText("Shell Header")).toBeInTheDocument();
    expect(screen.getByText("Modular App Content")).toBeInTheDocument();
    expect(screen.getByText("Shell Footer")).toBeInTheDocument();
  });
});
