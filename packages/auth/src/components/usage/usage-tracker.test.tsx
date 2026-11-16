import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { resetFallbackUsageLedger } from "@mono/database";
import { UsageProvider } from "./usage-provider";
import { UsageTracker } from "./usage-tracker";

describe("UsageTracker", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
    window.localStorage.clear();
  });

  it("renders card and compact variants and increments usage when action button is clicked", async () => {
    render(
      <UsageProvider
        roleOverride="member"
        disableAutoFetch
        initialCounts={{ blueprint_exports: { dailyUsed: 2, dailyLimit: 5 } }}
      >
        <UsageTracker
          metric="blueprint_exports"
          period="daily"
          showAction
          actionLabel="Export Blueprint"
          dailyLimitOverride={5}
        />
        <UsageTracker
          metric="blueprint_exports"
          variant="compact"
          dailyLimitOverride={5}
        />
      </UsageProvider>
    );

    expect(screen.getAllByText(/Blueprint & Graph Exports/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("2/5 exports")).toBeInTheDocument();

    const actionBtn = screen.getByRole("button", { name: /Export Blueprint/i });
    fireEvent.click(actionBtn);

    await waitFor(() => {
      expect(screen.getByText("3/5 exports")).toBeInTheDocument();
    });
  });
});
