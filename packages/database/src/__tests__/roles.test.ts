import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DEFAULT_USER_ROLE,
  getUserRole,
  listAllUserRoles,
  resetFallbackUserRoles,
  resolveSafeRoleFromUser,
  updateUserRole,
} from "../roles";
import * as clientModule from "../client";

describe("database roles module", () => {
  beforeEach(() => {
    resetFallbackUserRoles();
    vi.restoreAllMocks();
  });

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

  it("returns app_metadata role when present on user", async () => {
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

  it("does not allow user_metadata to escalate role to admin", () => {
    const role = resolveSafeRoleFromUser({
      id: "user-456",
      is_anonymous: false,
      user_metadata: { role: "admin" },
      app_metadata: {},
    });
    expect(role).toBe("member");
  });

  it("updates and lists user roles via admin helpers", async () => {
    const res = await updateUserRole("user-789", "admin");
    expect(res.success).toBe(true);

    const list = await listAllUserRoles();
    expect(list).toHaveLength(1);
    expect(list[0].userId).toBe("user-789");
    expect(list[0].role).toBe("admin");

    const demote = await updateUserRole("user-789", "member");
    expect(demote.success).toBe(true);
    const updated = await listAllUserRoles();
    expect(updated[0].role).toBe("member");
  });
});
