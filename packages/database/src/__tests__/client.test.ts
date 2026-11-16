import { describe, it, expect, afterEach } from "vitest";
import {
  assertServerOnlyExecution,
  createClient,
  createServiceClient,
  createTokenClient,
} from "../client";
import { updateUserRole } from "../roles";
import { recordAndCheckUsage } from "../usages";

describe("database client & server-only boundary guards", () => {
  afterEach(() => {
    delete (globalThis as any).__FORCE_BROWSER_SECURITY_GUARD;
  });

  it("initializes Supabase browser client with public credentials", () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it("throws a security violation if privileged helpers are called in a browser environment", async () => {
    (globalThis as any).window = (globalThis as any).window || {};
    (globalThis as any).__FORCE_BROWSER_SECURITY_GUARD = true;

    expect(() => assertServerOnlyExecution("createServiceClient")).toThrow(/Security Violation/);
    expect(() => createServiceClient()).toThrow(/Security Violation/);
    expect(() => createTokenClient("tok_123")).toThrow(/Security Violation/);
    await expect(updateUserRole("u1", "admin")).rejects.toThrow(/Security Violation/);
    await expect(
      recordAndCheckUsage({ userId: "u1", metric: "turns", amount: 1 })
    ).rejects.toThrow(/Security Violation/);
  });
});
