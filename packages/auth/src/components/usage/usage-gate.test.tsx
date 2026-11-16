import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetFallbackUsageLedger } from "@mono/database";
import { UsageProvider } from "./usage-provider";
import { UsageGate } from "./usage-gate";

describe("UsageGate", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
    window.localStorage.clear();
  });

  it("renders children unlocked when quota is available and role meets requirement", () => {
    render(
      <UsageProvider
        roleOverride="member"
        disableAutoFetch
        initialCounts={{ turns: { dailyUsed: 2, dailyLimit: 10 } }}
      >
        <UsageGate metric="turns" minRole="member">
          <button type="button">Protected Action</button>
        </UsageGate>
      </UsageProvider>
    );

    expect(screen.getByRole("button", { name: "Protected Action" })).toBeInTheDocument();
    expect(screen.queryByText(/Limit Reached/i)).not.toBeInTheDocument();
  });

  it("locks children with overlay or banner when quota is exhausted or role is insufficient", () => {
    const { rerender } = render(
      <UsageProvider
        roleOverride="guest"
        disableAutoFetch
        initialCounts={{ turns: { dailyUsed: 15, dailyLimit: 15 } }}
      >
        <UsageGate metric="turns" mode="overlay">
          <div>Gated Module</div>
        </UsageGate>
      </UsageProvider>
    );

    expect(screen.getByText(/Rose AI Turns Limit Reached/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In to Unlock/i })).toBeInTheDocument();

    rerender(
      <UsageProvider roleOverride="guest" disableAutoFetch>
        <UsageGate metric="blueprint_exports" minRole="pro" mode="banner">
          <div>Pro Module</div>
        </UsageGate>
      </UsageProvider>
    );

    expect(screen.getByText(/PRO Tier Required/i)).toBeInTheDocument();
  });
});
