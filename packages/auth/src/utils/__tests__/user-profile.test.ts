import { describe, it, expect } from "vitest";
import {
  getUserDisplayName,
  getUserAvatarUrl,
  getUserInitials,
  getUserProfileInfo,
} from "../user-profile";

describe("user-profile utilities", () => {
  it("extracts display name and avatar URL from user metadata with safe fallbacks", () => {
    expect(getUserDisplayName(null)).toBe("Guest");
    expect(getUserDisplayName({ is_anonymous: true })).toBe("Guest");
    expect(getUserDisplayName({ email: "dev@machi.asia" })).toBe("dev@machi.asia");
    expect(
      getUserDisplayName({
        email: "dev@machi.asia",
        user_metadata: { full_name: "Justine Kamachi" },
      })
    ).toBe("Justine Kamachi");

    expect(getUserAvatarUrl(null)).toBeUndefined();
    expect(
      getUserAvatarUrl({
        user_metadata: { picture: "https://example.com/avatar.png" },
      })
    ).toBe("https://example.com/avatar.png");
  });

  it("computes initials and full UserProfileInfo accurately", () => {
    expect(getUserInitials("Justine Kamachi")).toBe("JK");
    expect(getUserInitials("machi")).toBe("MA");

    const info = getUserProfileInfo({
      id: "u-123",
      email: "pro@machi.asia",
      app_metadata: { role: "pro" },
      user_metadata: { name: "Pro Builder", avatar_url: "https://example.com/p.png" },
    } as any);

    expect(info.id).toBe("u-123");
    expect(info.displayName).toBe("Pro Builder");
    expect(info.initials).toBe("PB");
    expect(info.role).toBe("pro");
    expect(info.isGuest).toBe(false);
  });
});
