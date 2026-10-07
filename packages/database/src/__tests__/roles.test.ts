import { describe, it, expect, vi } from "vitest";
import { DEFAULT_USER_ROLE, getUserRole } from "../roles";
import * as clientModule from "../client";

describe("database roles module", () => {
  it("exports DEFAULT_USER_ROLE as member", () => {
    expect(DEFAULT_USER_ROLE).toBe("member");
  });

  it("returns guest when user is not authenticated", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
    vi.spyOn(clientModule, "createClient").mockReturnValue(mockSupabase as any);

    const role = await getUserRole();
    expect(role).toBe("guest");
  });

  it("returns metadata role when present on user", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-123",
              app_metadata: { role: "admin" },
            },
          },
          error: null,
        }),
      },
    };
    vi.spyOn(clientModule, "createClient").mockReturnValue(mockSupabase as any);

    const role = await getUserRole();
    expect(role).toBe("admin");
  });
});
