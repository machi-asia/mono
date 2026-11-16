import { describe, it, expect } from "vitest";
import {
  APPS_CONFIG,
  DOMAIN_HOST_TO_APP_ID,
  isAppUnderDevelopment,
  getAppConfig,
  resolveSupabaseUrl,
  resolveSupabasePublishableKey,
  resolveSupabaseServerKey,
  resolveApiBaseUrl,
  isAllowedOrigin,
  isLocalHostname,
  isLocalEnvironment,
  resolveAppHref,
  resolveHref,
  SUPABASE_CONFIG,
} from "../index.js";

describe("@mono/app-config", () => {
  it("manages apps underDevelopment status and devPorts", () => {
    expect(APPS_CONFIG.create.underDevelopment).toBe(false);
    expect(APPS_CONFIG.rimworld.underDevelopment).toBe(true);

    expect(isAppUnderDevelopment("create")).toBe(false);
    expect(isAppUnderDevelopment("rimworld")).toBe(true);

    expect(getAppConfig("create")?.name).toBe("Create");
    expect(getAppConfig("rimworld")?.name).toBe("RimWorld");
    expect(getAppConfig("api")?.appUrl).toBe("https://api.machi.asia");
    expect(getAppConfig("calculator")?.devPort).toBe(3001);
    expect(getAppConfig("docs")?.devPort).toBe(3002);
    expect(getAppConfig("hells-forge")?.devPort).toBe(3003);
    expect(getAppConfig("rose")?.devPort).toBe(3004);
    expect(getAppConfig("api")?.devPort).toBe(3005);
    expect(getAppConfig("portfolio")?.devPort).toBe(3006);
    expect(getAppConfig("home")?.devPort).toBe(3010);
    expect(getAppConfig("create")?.devPort).toBe(3011);
    expect(getAppConfig("rimworld")?.devPort).toBe(3012);
    expect(getAppConfig("admin")?.devPort).toBe(3013);
  });

  it("resolves canonical Supabase URL and keys", () => {
    expect(resolveSupabaseUrl()).toBe(SUPABASE_CONFIG.url);
    expect(resolveSupabasePublishableKey()).toBe(SUPABASE_CONFIG.anonKey);
    expect(resolveSupabaseServerKey()).toBeTruthy();
  });

  it("resolves API base URL and validates CORS origins", () => {
    expect(resolveApiBaseUrl({ forceLocal: false })).toBe("https://api.machi.asia");
    expect(resolveApiBaseUrl({ forceLocal: true })).toBe("http://localhost:3005");
    expect(isAllowedOrigin("https://rose.machi.asia")).toBe(true);
    expect(isAllowedOrigin("https://create.itemlist.online")).toBe(true);
    expect(isAllowedOrigin("http://localhost:3004")).toBe(true);
    expect(isAllowedOrigin("https://evil.example.com")).toBe(false);
  });

  it("detects local hostnames and rewrites domain links to localhost equivalents when local", () => {
    expect(isLocalHostname("localhost")).toBe(true);
    expect(isLocalHostname("127.0.0.1")).toBe(true);
    expect(isLocalHostname("machi.asia")).toBe(false);
    expect(isLocalEnvironment({ currentHostname: "localhost" })).toBe(true);
    expect(isLocalEnvironment({ currentHostname: "machi.asia" })).toBe(false);

    // Production mode preserves domain URLs
    expect(resolveHref("https://calculator.machi-asia.com/satisfactory?rate=60#graph", { forceLocal: false })).toBe(
      "https://calculator.machi-asia.com/satisfactory?rate=60#graph"
    );

    // Local mode rewrites all known Machi Asia and ItemList domain URLs to their localhost ports
    expect(resolveHref("https://machi.asia", { forceLocal: true })).toBe("http://localhost:3000");
    expect(resolveHref("https://calculator.machi-asia.com/satisfactory?rate=60#graph", { forceLocal: true })).toBe(
      "http://localhost:3001/satisfactory?rate=60#graph"
    );
    expect(resolveHref("https://docs.machi.asia/components/auth", { forceLocal: true })).toBe(
      "http://localhost:3002/components/auth"
    );
    expect(resolveHref("https://forge.machi-asia.com", { forceLocal: true })).toBe(
      "http://localhost:3003"
    );
    expect(resolveHref("https://hellsforge.machi.asia/arena", { forceLocal: true })).toBe(
      "http://localhost:3003/arena"
    );
    expect(resolveHref("https://rose.machi.asia", { forceLocal: true })).toBe(
      "http://localhost:3004"
    );
    expect(resolveHref("https://api.machi.asia/health", { forceLocal: true })).toBe(
      "http://localhost:3005/health"
    );
    expect(resolveHref("https://portfolio.machi.asia", { forceLocal: true })).toBe(
      "http://localhost:3006"
    );
    expect(resolveHref("https://itemlist.online", { forceLocal: true })).toBe(
      "http://localhost:3010"
    );
    expect(resolveHref("https://create.itemlist.online/?item=cogwheel", { forceLocal: true })).toBe(
      "http://localhost:3011/?item=cogwheel"
    );
    expect(resolveHref("https://rimworld.itemlist.online", { forceLocal: true })).toBe(
      "http://localhost:3012"
    );
    expect(resolveHref("https://admin.itemlist.online/login", { forceLocal: true })).toBe(
      "http://localhost:3013/login"
    );

    // Unrelated external links remain untouched
    expect(resolveHref("https://github.com/machi-asia/mono", { forceLocal: true })).toBe(
      "https://github.com/machi-asia/mono"
    );
    expect(resolveHref("/about", { forceLocal: true })).toBe("/about");
    expect(resolveHref("#section", { forceLocal: true })).toBe("#section");

    // resolveAppHref helper
    expect(resolveAppHref("rose", "/chat", { forceLocal: true })).toBe("http://localhost:3004/chat");
    expect(resolveAppHref("rose", "/chat", { forceLocal: false })).toBe("https://rose.machi.asia/chat");
    expect(Object.keys(DOMAIN_HOST_TO_APP_ID).length).toBeGreaterThan(15);
  });
});
