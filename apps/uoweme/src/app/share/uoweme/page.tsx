"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Coins } from "lucide-react";
import { AuthNavbar } from "@mono/auth";
import { Button } from "@mono/components";
import { formatPeso } from "@/components/DebtDashboard";

function ShareStatementCard() {
  const router = useRouter();
  const params = useSearchParams();
  const person = params.get("person") || "Alyssa Reyes";
  const amount = Number(params.get("amount") || "1030");
  const direction = params.get("direction") === "i_owe_them" ? "i_owe_them" : "they_owe_me";
  const items = Number(params.get("items") || "2");

  return (
    <main className="uow-main" style={{ maxWidth: "560px", paddingTop: "6rem" }}>
      <div className="uow-stat-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Coins size={22} style={{ color: "var(--uow-accent-light)" }} />
          <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>
            Settlement Statement
          </h1>
        </div>

        <p style={{ margin: 0, color: "var(--uow-muted)", fontSize: "0.9rem" }}>
          Verified peer balance summary across {items} unsettled ledger entry(s).
        </p>

        <div
          style={{
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid var(--uow-border)",
            background: "rgb(var(--uow-text-rgb) / 3%)",
          }}
        >
          <div style={{ fontSize: "0.78rem", color: "var(--uow-muted)", textTransform: "uppercase" }}>
            {direction === "they_owe_me" ? `${person} owes` : `You owe ${person}`}
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginTop: "0.25rem",
              color: direction === "they_owe_me" ? "var(--uow-positive)" : "var(--uow-negative)",
            }}
          >
            {formatPeso(Number.isFinite(amount) ? amount : 0)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--uow-positive)", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <CheckCircle2 size={14} /> Ready to settle
          </span>
          <Button variant="primary" onClick={() => router.push("/")}>
            <ArrowLeft size={14} /> Open Full Ledger
          </Button>
        </div>
      </div>
    </main>
  );
}

export function ShareLedgerPage() {
  return (
    <div className="uow-body">
      <AuthNavbar brand={<strong>U Owe Me</strong>} />
      <Suspense fallback={<div className="uow-main">Loading statement...</div>}>
        <ShareStatementCard />
      </Suspense>
    </div>
  );
}

export default ShareLedgerPage;
