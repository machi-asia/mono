import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UsageSection } from "./usage-section";
import * as db from "@mono/database";

vi.mock("../../client", () => ({
  createClient: () => ({}),
}));

describe("UsageSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders role tier and quota gauges for all 4 metrics", async () => {
    vi.spyOn(db, "getUserUsageSummary").mockResolvedValue([
      {
        id: "1",
        user_id: "user-1",
        app: "rose",
        metric: "turns",
        period_type: "daily",
        period_key: db.currentDay(),
        count: 10,
        usage_limit: 60,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    const user: any = {
      id: "user-1",
      email: "user@example.com",
      app_metadata: { role: "member" },
      user_metadata: { role: "admin" }, // untrusted, should remain member
      is_anonymous: false,
    };

    render(<UsageSection user={user} />);

    expect(screen.getByText("API Usage & Quotas")).toBeInTheDocument();
    expect(screen.getByText("MEMBER TIER")).toBeInTheDocument();
    expect(screen.getByText("API Gateway Requests")).toBeInTheDocument();
    expect(screen.getByText("Rose AI Conversation Turns")).toBeInTheDocument();
    expect(screen.getByText("AI Inference Tokens")).toBeInTheDocument();
    expect(screen.getByText("Cloud Media Storage")).toBeInTheDocument();

    const refreshBtn = screen.getByRole("button", { name: "Refresh usage" });
    fireEvent.click(refreshBtn);
    expect(db.getUserUsageSummary).toHaveBeenCalled();
  });
});
