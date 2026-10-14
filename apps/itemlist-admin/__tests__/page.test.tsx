import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

vi.mock("../lib/supabase", () => ({
  getAdminSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
}));

import AdminDashboardPage from "../app/page";

describe("AdminDashboardPage", () => {
  it("renders authentication required or dashboard state without crashing", () => {
    const { container } = render(<AdminDashboardPage />);
    expect(container).toBeDefined();
  });
});
