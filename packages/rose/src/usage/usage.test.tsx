import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getRoleLimits } from "./usage";
import { UsageBar } from "./usage-bar";
import { MockAuthProvider } from "@mono/auth/mock";

describe("Rose Usage Feature", () => {
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
      expect(limits.dailyLimit).toBe(10);
      expect(limits.weeklyLimit).toBe(50);
    });

    it("assigns authenticated user quotas by default", () => {
      const limits = getRoleLimits([]);
      expect(limits.role).toBe("authenticated");
      expect(limits.dailyLimit).toBe(20);
      expect(limits.weeklyLimit).toBe(200);
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
  });
});
