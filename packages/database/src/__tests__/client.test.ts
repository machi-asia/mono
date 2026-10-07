import { describe, it, expect } from "vitest";
import { createClient } from "../client";

describe("database client module", () => {
  it("initializes Supabase browser client with public credentials", () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });
});
