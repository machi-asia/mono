import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { getRoleLimits } from "../../utils/usage";
import { UsageBar, setCachedUsage } from "./usage-bar";
import { MockAuthProvider } from "@mono/auth/mock";

describe("Rose Usage Feature", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("Role Limits", () => {
    it("assigns unlimited quotas for admin", () => {
      const limits = getRoleLimits(["admin"]);
      expect(limits.role).toBe("admin");
      expect(limits.dailyLimit).toBe(Infinity);
      expect(limits.weeklyLimit).toBe(Infinity);
    });

    it("assigns guest quotas for guest role", () => {
      const limits = getRoleLimits(["guest"]);
      expect(limits.role).toBe("guest");
      expect(limits.dailyLimit).toBe(15);
      expect(limits.weeklyLimit).toBe(150);
    });

    it("assigns authenticated member quotas by default", () => {
      const limits = getRoleLimits([]);
      expect(["member", "authenticated"]).toContain(limits.role);
      expect(limits.dailyLimit).toBe(60);
      expect(limits.weeklyLimit).toBe(1200);
    });
  });

  describe("UsageBar Component", () => {
    it("renders quota metrics correctly", () => {
      render(
        <MockAuthProvider state="signed-in">
          <UsageBar
            usage={{
              allowed: true,
              count: 45,
              limit: 200,
              week: "2026-W36",
              dailyCount: 5,
              dailyLimit: 20,
              day: "2026-09-03",
              remaining: 15,
              role: "authenticated",
            }}
          />
        </MockAuthProvider>
      );

      expect(screen.getByText(/User Tier/i)).toBeInTheDocument();
      expect(screen.getByText(/15 remaining today/i)).toBeInTheDocument();
      expect(screen.getByText(/Messages Today/i)).toBeInTheDocument();
    });

    it("renders unlimited badge for admin", () => {
      render(
        <MockAuthProvider state="signed-in">
          <UsageBar
            usage={{
              allowed: true,
              count: 0,
              limit: Infinity,
              week: "2026-W36",
              dailyCount: 0,
              dailyLimit: Infinity,
              day: "2026-09-03",
              remaining: Infinity,
              role: "admin",
            }}
          />
        </MockAuthProvider>
      );

      expect(screen.getByText(/Admin Tier/i)).toBeInTheDocument();
      expect(screen.getByText(/Unlimited Messages/i)).toBeInTheDocument();
    });

    it("hydrates without mismatch when localStorage has cached guest usage and transitions to cached quota", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false } as Response)
      );

      const element = (
        <MockAuthProvider state="signed-out">
          <UsageBar />
        </MockAuthProvider>
      );

      // Simulate SSR where localStorage is unavailable during server render
      const ssrHtml = renderToString(element);

      setCachedUsage("guest", {
        allowed: true,
        count: 12,
        limit: 50,
        week: "2026-W47",
        dailyCount: 3,
        dailyLimit: 10,
        day: "2026-11-21",
        remaining: 7,
        role: "guest",
      });

      const container = document.createElement("div");
      container.innerHTML = ssrHtml;
      document.body.appendChild(container);

      const recoverableErrors: unknown[] = [];
      let root: ReturnType<typeof hydrateRoot> | null = null;

      await act(async () => {
        root = hydrateRoot(container, element, {
          onRecoverableError: (err) => recoverableErrors.push(err),
        });
      });

      expect(recoverableErrors).toHaveLength(0);

      await waitFor(() => {
        expect(container.textContent).toMatch(/Guest Tier/i);
        expect(container.textContent).toMatch(/7 remaining today/i);
      });

      act(() => {
        root?.unmount();
      });
      container.remove();
    });
  });
});
