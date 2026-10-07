import { describe, it, expect } from "vitest";
import { recordApiCall, getSystemUsageSummary } from "../server/usage/tracker";

describe("apps/api Server Telemetry & Handlers", () => {
  it("records API metrics and generates system summary", async () => {
    recordApiCall("/rose/chat", "POST", 150, false);
    recordApiCall("/sync/events", "POST", 25, false);

    const summary = await getSystemUsageSummary();
    expect(summary.status).toBe("healthy");
    expect(summary.totalRequests).toBeGreaterThanOrEqual(2);
    expect(summary.endpoints["POST /rose/chat"]).toBeDefined();
    expect(summary.endpoints["POST /rose/chat"].count).toBeGreaterThanOrEqual(1);
    expect(summary.endpoints["POST /sync/events"]).toBeDefined();
  });
});
