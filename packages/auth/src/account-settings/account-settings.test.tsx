import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountSettings } from "./account-settings";

const mockUseAuth = vi.fn();

vi.mock("../provider/provider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../client", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: {
                id: "test-ticket-id",
                type: "bug_report",
                app: "machi-asia",
                subject: "Test bug",
                message: "Steps to reproduce",
                status: "open",
                created_at: new Date().toISOString(),
              },
              error: null,
            }),
        }),
      }),
    }),
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

  it("shows Profile tab by default with display name and avatar selector", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
    expect(screen.getByText("Profile Picture")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Name" })).toBeInTheDocument();
  });

  it("shows all security sub-navigation items when switching to Security", () => {
    render(<AccountSettings open={true} onClose={() => {}} initialTab="security" />);
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
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
  });

  it("switches to passkeys section when clicked", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).PublicKeyCredential = function () {};
    render(<AccountSettings open={true} onClose={() => {}} initialTab="security" />);
    fireEvent.click(screen.getByRole("button", { name: "Passkeys" }));
    expect(
      screen.getByRole("button", { name: "Add Passkey" }),
    ).toBeInTheDocument();
  });

  it("switches to providers section when clicked and allows swapping account", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser({
        identities: [
          {
            id: "id-google",
            provider: "google",
            identity_data: { email: "googleuser@gmail.com", picture: "https://example.com/google.png" },
            last_sign_in_at: "",
            created_at: "",
          },
        ],
      }),
      session: { user: mockUser() },
      isLoading: false,
      isGuest: false,
    });

    render(<AccountSettings open={true} onClose={() => {}} initialTab="security" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Linked Providers" }),
    );
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("googleuser@gmail.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Swap Account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unlink" })).toBeInTheDocument();
  });

  it("switches to MFA section when clicked", () => {
    render(<AccountSettings open={true} onClose={() => {}} initialTab="security" />);
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

  it("shows Data & Privacy tab in the sidebar and switches to it", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    const privacyTab = screen.getByRole("button", { name: "Data & Privacy" });
    expect(privacyTab).toBeInTheDocument();

    fireEvent.click(privacyTab);
    expect(screen.getByText("Application Data Collection Registry")).toBeInTheDocument();
    expect(screen.getByText("Machi Asia (Home & Billing Hub)")).toBeInTheDocument();
    expect(screen.getByText("Export Account Data (JSON)")).toBeInTheDocument();
  });

  it("opens directly to Data & Privacy when initialTab is privacy", () => {
    render(
      <AccountSettings
        open={true}
        onClose={() => {}}
        initialTab="privacy"
      />,
    );
    expect(screen.getByText("Application Data Collection Registry")).toBeInTheDocument();
  });

  it("shows Support tab in the sidebar and switches to it", () => {
    render(<AccountSettings open={true} onClose={() => {}} />);
    const supportTab = screen.getByRole("button", { name: "Support" });
    expect(supportTab).toBeInTheDocument();

    fireEvent.click(supportTab);
    expect(screen.getByText("Support & Recommendations")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Application")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("submits a support bug report to the database", async () => {
    render(
      <AccountSettings
        open={true}
        onClose={() => {}}
        initialTab="support"
      />,
    );

    const subjectInput = screen.getByLabelText("Subject");
    const descInput = screen.getByLabelText("Description / Details");

    fireEvent.change(subjectInput, { target: { value: "Graph visual glitch" } });
    fireEvent.change(descInput, { target: { value: "Nodes overlap on zoom out" } });

    fireEvent.click(screen.getByRole("button", { name: /Submit Bug Report/i }));

    expect(
      await screen.findByText(/Your bug report has been submitted directly to the database/i),
    ).toBeInTheDocument();
  });
});
