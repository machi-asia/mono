import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastProvider } from "@mono/components";
import { AuthContext } from "./provider/provider";
import { UsageProvider } from "./usage/usage-provider";
import { useApiClient } from "./use-api-client";

function ApiClientConsumer() {
  const client = useApiClient({ baseUrl: "http://localhost:3005" });

  return (
    <button
      type="button"
      onClick={() => {
        void client.rose.getUsage();
      }}
    >
      Call API
    </button>
  );
}

describe("useApiClient", () => {
  it("injects session access token and triggers quota lock toast on 429 response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: { get: () => "60" },
      json: () =>
        Promise.resolve({
          error: { code: "usage_limit_exceeded", message: "Daily Rose AI limit reached" },
          usage: { exceededType: "daily" },
        }),
    });
    global.fetch = mockFetch;

    render(
      <ToastProvider>
        <AuthContext.Provider
          value={{
            user: { id: "u-1" } as any,
            session: { access_token: "jwt-123" } as any,
            isLoading: false,
            isGuest: false,
            role: "member",
            accounts: [],
            signInWithEmail: vi.fn(),
            signUpWithEmail: vi.fn(),
            signInWithGoogle: vi.fn(),
            signInWithGithub: vi.fn(),
            signInAsGuest: vi.fn(),
            switchAccount: vi.fn(),
            removeAccount: vi.fn(),
            signOut: vi.fn(),
            refreshRole: vi.fn(),
          }}
        >
          <UsageProvider disableAutoFetch>
            <ApiClientConsumer />
          </UsageProvider>
        </AuthContext.Provider>
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Call API" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/rose/usage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-123",
        },
      });
    });
  });
});
