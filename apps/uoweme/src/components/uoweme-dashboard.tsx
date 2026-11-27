"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Plus, Search, Sparkles } from "lucide-react";
import { AuthNavbar, SignInModal } from "@mono/auth";
import { Button } from "@mono/components";
import { useDebts } from "@/hooks/useDebts";
import type { ContactLedgerSummary } from "@/data/types";
import { DebtDashboard } from "./DebtDashboard";
import { ContactBalanceTable } from "./ContactBalanceTable";
import { AddDebtDialog } from "./AddDebtDialog";

export function UOweMeDashboard() {
  const router = useRouter();
  const {
    user,
    totals,
    contactSummaries,
    isUsingDemo,
    addDebt,
    toggleSettled,
    deleteDebt,
    settleContactAll,
  } = useDebts();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "open" | "settled">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const visibleContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return contactSummaries
      .map((contact) => {
        const filteredEntries = contact.entries.filter((entry) => {
          if (filterMode === "open" && entry.settled) return false;
          if (filterMode === "settled" && !entry.settled) return false;
          if (q) {
            return (
              contact.person.toLowerCase().includes(q) ||
              entry.note.toLowerCase().includes(q)
            );
          }
          return true;
        });
        return {
          ...contact,
          entries: filteredEntries,
        };
      })
      .filter((c) => c.entries.length > 0);
  }, [contactSummaries, filterMode, searchQuery]);

  const handleShareContact = (summary: ContactLedgerSummary) => {
    const direction = summary.netBalance >= 0 ? "they_owe_me" : "i_owe_them";
    const params = new URLSearchParams({
      person: summary.person,
      amount: String(Math.abs(summary.netBalance)),
      direction,
      items: String(summary.unsettledCount),
    });
    router.push(`/share/uoweme?${params.toString()}`);
  };

  return (
    <div className="uow-body">
      <AuthNavbar
        brand={
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", fontWeight: 800 }}>
            <Coins size={20} style={{ color: "var(--uow-accent-light)" }} />
            <span>U Owe Me</span>
          </span>
        }
        links={[
          { label: "Machi Hub", href: "https://machi.asia" },
          { label: "Notes", href: "https://notes.machi.asia" },
        ]}
        actions={
          !user ? (
            <Button size="sm" variant="secondary" onClick={() => setShowSignIn(true)}>
              Sign In to Cloud Ledger
            </Button>
          ) : undefined
        }
      />

      <main className="uow-main">
        <div className="uow-container">
          {isUsingDemo && (
            <div className="uow-banner">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                <Sparkles size={15} style={{ color: "var(--uow-accent-light)" }} />
                <strong>Demo Ledger Mode:</strong> Try logging IOUs, settling balances, or generating shareable statements. Sign in anytime to persist across devices.
              </span>
            </div>
          )}

          <header className="uow-header">
            <div>
              <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>
                Peer IOU Ledger
              </h1>
              <p style={{ margin: "0.35rem 0 0", color: "var(--uow-muted)", fontSize: "0.92rem" }}>
                Consolidate shared meals, group trips, and split bills into clean per-contact net balances.
              </p>
            </div>

            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Log Expense / IOU
            </Button>
          </header>

          <DebtDashboard
            totalOwedToMe={totals.totalOwedToMe}
            totalIOwe={totals.totalIOwe}
            netPosition={totals.netPosition}
            unsettledCount={totals.unsettledCount}
          />

          <div className="uow-controls">
            <div style={{ position: "relative", flex: 1, minWidth: "240px", maxWidth: "420px" }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--uow-muted)",
                }}
              />
              <input
                type="text"
                className="uow-input"
                style={{ paddingLeft: "2.3rem" }}
                placeholder="Filter by contact or memo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="uow-pill-tabs" role="group" aria-label="Entry status filter">
              {(["all", "open", "settled"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`uow-pill-tab ${filterMode === mode ? "active" : ""}`}
                  onClick={() => setFilterMode(mode)}
                  style={{ textTransform: "capitalize" }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <ContactBalanceTable
            contacts={visibleContacts}
            onToggleSettled={(id, settled) => void toggleSettled(id, settled)}
            onSettleContact={(person) => void settleContactAll(person)}
            onDeleteDebt={(id) => void deleteDebt(id)}
            onShareContact={handleShareContact}
          />
        </div>
      </main>

      <AddDebtDialog
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addDebt}
      />

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          title="Sign in to U Owe Me"
          subtitle="Keep your personal IOU ledger backed up in Supabase."
        />
      )}
    </div>
  );
}
