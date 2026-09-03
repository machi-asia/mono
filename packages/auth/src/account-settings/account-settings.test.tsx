import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountSettings } from "./account-settings";

const mockUseAuth = vi.fn();

vi.mock("../provider/provider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../client", () => ({
  createClient: () => ({
    auth: {
      updateUser: vi.fn(),
      getUser: vi.fn(),
      linkIdentity: vi.fn(),
      unlinkIdentity: vi.fn(),
      signInWithPasskey: vi.fn(),
      mfa: {
        enroll: vi.fn(),
        challenge: vi.fn(),
        verify: vi.fn(),
        unenroll: vi.fn(),
        listFactors: vi.fn().mockResolvedValue({
          data: { totp: [], webauthn: [] },
          error: null,
        }),
      },
    },
  }),
}));

function mockUser(overrides?: Record<string, unknown>) {
  return {
    id: "test-user",
    email: "test@example.com",
    user_metadata: {},
    is_anonymous: false,
    identities: [
      {
        id: "id-email",
        provider: "email",
        identity_data: { email: "test@example.com" },
        last_sign_in_at: "",
        created_at: "",
      },
    ],
    ...overrides,
  };
}

describe("AccountSettings", () => {
  beforeEach(() => {
    // Reset PublicKeyCredential mock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).PublicKeyCredential;
    mockUseAuth.mockReset();
    mockUseAuth.mockReturnValue({
      user: mockUser(),
      session: { user: mockUser() },
      isLoading: false,
      isGuest: false,
    });
  });

  it("renders nothing when open is false", () => {
    render(<AccountSettings open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog when open is true", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    expect(
      screen.getByRole("dialog", { name: "Account settings" }),
    ).toBeInTheDocument();
  });

  it("renders nothing when there is no user", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      isGuest: false,
    });
    render(<AccountSettings open={true} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows Security tab in the sidebar", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Security" }),
    ).toBeInTheDocument();
  });

  it("shows all security sub-navigation items", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Change Password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Passkeys" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Linked Providers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Multi-Factor Authentication" }),
    ).toBeInTheDocument();
  });

  it("shows password form by default", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("switches to passkeys section when clicked", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).PublicKeyCredential = function () {};
    render(<AccountSettings open={true} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Passkeys" }));
    expect(
      screen.getByRole("button", { name: "Add Passkey" }),
    ).toBeInTheDocument();
  });

  it("switches to providers section when clicked", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Linked Providers" }),
    );
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("switches to MFA section when clicked", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Multi-Factor Authentication" }),
    );
    expect(
      screen.getByRole("button", { name: "Add Authenticator" }),
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<AccountSettings open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the overlay is clicked", () => {
    const onClose = vi.fn();
    render(<AccountSettings open={true} onClose={onClose} />);
    const dialog = screen.getByRole("dialog", { name: "Account settings" });
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
