import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAuthRedirectUrl } from "../redirect";

describe("getAuthRedirectUrl", () => {
  const originalEnv = process.env;
  const originalLocation = window.location;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  it("constructs redirect with custom NEXT_PUBLIC_API_URL when provided", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://custom-api.machi.asia/";
    const url = getAuthRedirectUrl("https://calculator.machi.asia/items");
    expect(url).toBe(
      "https://custom-api.machi.asia/redirect?returnTo=https%3A%2F%2Fcalculator.machi.asia%2Fitems",
    );
  });

  it("constructs localhost:3005/redirect when in local environment", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    Object.defineProperty(window, "location", {
      value: {
        hostname: "localhost",
        href: "http://localhost:3000/dashboard",
      },
      writable: true,
    });

    const url = getAuthRedirectUrl();
    expect(url).toBe(
      "http://localhost:3005/redirect?returnTo=http%3A%2F%2Flocalhost%3A3000%2Fdashboard",
    );
  });

  it("constructs https://api.machi.asia/redirect in production", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    Object.defineProperty(window, "location", {
      value: {
        hostname: "machi.asia",
        href: "https://machi.asia/account",
      },
      writable: true,
    });

    const url = getAuthRedirectUrl();
    expect(url).toBe(
      "https://api.machi.asia/redirect?returnTo=https%3A%2F%2Fmachi.asia%2Faccount",
    );
  });

  it("encodes complex query parameters within destination URL", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    Object.defineProperty(window, "location", {
      value: {
        hostname: "hellsforge.machi.asia",
        href: "https://hellsforge.machi.asia/?step=2&tab=weapons",
      },
      writable: true,
    });

    const url = getAuthRedirectUrl();
    expect(url).toBe(
      "https://api.machi.asia/redirect?returnTo=https%3A%2F%2Fhellsforge.machi.asia%2F%3Fstep%3D2%26tab%3Dweapons",
    );
  });
});
