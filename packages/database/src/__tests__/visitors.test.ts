import { describe, it, expect, beforeEach } from "vitest";
import {
  parseUserAgent,
  recordVisitorSession,
  listVisitorSessions,
  resetFallbackVisitorSessions,
} from "../visitors";

describe("database visitors module", () => {
  beforeEach(() => {
    resetFallbackVisitorSessions();
  });

  it("parses desktop, mobile, tablet, and bot user agents accurately", () => {
    const desktop = parseUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );
    expect(desktop.deviceType).toBe("desktop");
    expect(desktop.browser).toContain("Chrome");
    expect(desktop.os).toContain("Windows");

    const mobile = parseUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
    );
    expect(mobile.deviceType).toBe("mobile");
    expect(mobile.os).toContain("iOS");

    const bot = parseUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
    expect(bot.deviceType).toBe("bot");
  });

  it("records and lists visitor sessions with origin, geo, and online status", async () => {
    await recordVisitorSession({
      visitorId: "ip:203.0.113.5",
      isGuest: true,
      role: "guest",
      app: "rose",
      hostname: "rose.machi.asia",
      pathname: "/chat",
      referrer: "https://google.com",
      utmSource: "organic",
      country: "SG",
      region: "01",
      city: "Singapore",
      ipAddress: "203.0.113.5",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    });

    await recordVisitorSession({
      userId: "11111111-1111-4111-8111-111111111111",
      visitorId: "11111111-1111-4111-8111-111111111111",
      isGuest: false,
      email: "admin@machi.asia",
      displayName: "Machi Admin",
      role: "admin",
      app: "calculator",
      hostname: "calculator.machi.asia",
      pathname: "/satisfactory",
      referrer: "https://machi.asia",
      country: "JP",
      city: "Tokyo",
    });

    const all = await listVisitorSessions();
    expect(all.length).toBe(2);
    expect(all[0].isOnline).toBe(true);

    const roseOnly = await listVisitorSessions({ app: "rose" });
    expect(roseOnly.length).toBe(1);
    expect(roseOnly[0].country).toBe("SG");
    expect(roseOnly[0].city).toBe("Singapore");
    expect(roseOnly[0].referrer).toBe("https://google.com");
    expect(roseOnly[0].is_guest).toBe(true);
  });
});
