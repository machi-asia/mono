import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MockAuthProvider } from "../mock/mock";
import { UsageProvider } from "../usage/usage-provider";
import { AuthNavbar } from "./auth-navbar";

describe("AuthNavbar", () => {
  it("renders brand, links, compact usage tracker pill, and authenticated user menu", () => {
    render(
      <MockAuthProvider state="signed-in">
        <UsageProvider
          roleOverride="member"
          disableAutoFetch
          initialCounts={{ blueprint_exports: { dailyUsed: 4, dailyLimit: 25 } }}
        >
          <AuthNavbar
            brand={<span>Machi Test Brand</span>}
            links={[
              { label: "Home", href: "/", active: true },
              { label: "Docs", href: "/docs" },
            ]}
            usageMetric="blueprint_exports"
            showDisplayMenuItem
          />
        </UsageProvider>
      </MockAuthProvider>
    );

    expect(screen.getByText("Machi Test Brand")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("4/25 exports")).toBeInTheDocument();

    // Open user dropdown menu
    const userTrigger = screen.getByRole("button", { name: /demo@machi\.asia/i });
    fireEvent.click(userTrigger);

    expect(screen.getByRole("menuitem", { name: /Account settings/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Usage & quotas/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Display & theme/i })).toBeInTheDocument();
  });
});
