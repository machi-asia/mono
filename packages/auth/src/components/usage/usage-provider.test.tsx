import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { resetFallbackUsageLedger } from "@mono/database";
import { UsageProvider, useUsage } from "./usage-provider";

function TestMetricConsumer({ metric = "blueprint_exports" }: { metric?: string }) {
  const usage = useUsage(metric, { dailyLimitOverride: 3 });

  return (
    <div>
      <span data-testid="used">{usage.dailyUsed}</span>
      <span data-testid="limit">{usage.dailyLimit}</span>
      <span data-testid="locked">{String(usage.locked)}</span>
      <button type="button" onClick={() => void usage.track(1)}>
        Track
      </button>
    </div>
  );
}

describe("UsageProvider and useUsage", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
    window.localStorage.clear();
  });

  it("tracks metric increments reactively and locks when dailyLimit is reached", async () => {
    render(
      <UsageProvider roleOverride="member" disableAutoFetch>
        <TestMetricConsumer metric="blueprint_exports" />
      </UsageProvider>
    );

    expect(screen.getByTestId("used").textContent).toBe("0");
    expect(screen.getByTestId("limit").textContent).toBe("3");
    expect(screen.getByTestId("locked").textContent).toBe("false");

    const btn = screen.getByRole("button", { name: "Track" });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByTestId("used").textContent).toBe("1");
    });

    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByTestId("used").textContent).toBe("3");
      expect(screen.getByTestId("locked").textContent).toBe("true");
    });
  });
});
