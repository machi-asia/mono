"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Boxes, CheckCircle2 } from "lucide-react";
import { AuthNavbar, SignInModal, useAuth } from "@mono/auth";
import { Button } from "@mono/components";

function JoinInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";
  const { user } = useAuth();

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedOrg, setJoinedOrg] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      setError("Please enter an invite code.");
      return;
    }
    if (!user) {
      setShowSignIn(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mmm/organizations/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: code.trim() }),
      });
      const json = (await res.json()) as {
        organization?: { name: string };
        error?: string;
      };
      if (!res.ok || !json.organization) {
        setError(json.error ?? "Invite code not found.");
        return;
      }
      setJoinedOrg(json.organization.name);
      setTimeout(() => router.push("/"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mmm-shell-main" style={{ maxWidth: "560px", paddingTop: "6rem" }}>
      <div className="mmm-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Boxes size={22} style={{ color: "var(--accent-light)" }} />
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Join MMM Modpack</h1>
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
          Paste an organization invite code to subscribe to your server&apos;s synchronized modlist and changelog.
        </p>

        <input
          type="text"
          className="mmm-input"
          placeholder="Invite code (e.g. A1B2C3D4)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {error && <p style={{ margin: 0, fontSize: "0.85rem", color: "#f87171" }}>{error}</p>}
        {joinedOrg && (
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#34d399", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} /> Joined {joinedOrg}! Redirecting...
          </p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
          <Button variant="primary" loading={loading} onClick={() => void handleJoin()}>
            {user ? "Accept Invite" : "Sign In to Join"}
          </Button>
        </div>
      </div>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          title="Sign in to join modpack"
          subtitle="Sign in with your Machi account to accept this organization invite."
        />
      )}
    </main>
  );
}

export default function JoinOrganizationPage() {
  return (
    <div className="mmm-body">
      <AuthNavbar brand={<strong>MMM</strong>} />
      <Suspense fallback={<div className="mmm-shell-main">Loading invite...</div>}>
        <JoinInviteContent />
      </Suspense>
    </div>
  );
}
