"use client";

import { useState } from "react";
import { CheckCheck, CheckCircle2, ChevronDown, ChevronRight, Share2, Trash2 } from "lucide-react";
import { Button } from "@mono/components";
import type { ContactLedgerSummary } from "@/data/types";
import { formatPeso } from "./DebtDashboard";

interface ContactBalanceTableProps {
  contacts: ContactLedgerSummary[];
  onToggleSettled: (id: string, settled: boolean) => void;
  onSettleContact: (person: string) => void;
  onDeleteDebt: (id: string) => void;
  onShareContact: (summary: ContactLedgerSummary) => void;
}

export function ContactBalanceTable({
  contacts,
  onToggleSettled,
  onSettleContact,
  onDeleteDebt,
  onShareContact,
}: ContactBalanceTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const first = contacts[0]?.person;
    return first ? { [first]: true } : {};
  });

  const toggleContact = (person: string) => {
    setExpanded((prev) => ({ ...prev, [person]: !prev[person] }));
  };

  if (contacts.length === 0) {
    return (
      <div className="uow-stat-card" style={{ textAlign: "center", padding: "2.5rem" }}>
        <p style={{ margin: 0, color: "var(--uow-muted)" }}>
          No matching contacts or IOU records found.
        </p>
      </div>
    );
  }

  return (
    <div className="uow-contact-list" data-testid="contact-balance-table">
      {contacts.map((summary) => {
        const isOpen = expanded[summary.person] ?? false;
        const isPositive = summary.netBalance >= 0;

        return (
          <div key={summary.person} className="uow-contact-card">
            <button
              type="button"
              className="uow-contact-trigger"
              aria-expanded={isOpen}
              onClick={() => toggleContact(summary.person)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <div>
                  <strong style={{ fontSize: "1rem" }}>{summary.person}</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--uow-muted)", marginTop: "0.15rem" }}>
                    {summary.entries.length} total · {summary.unsettledCount} unsettled
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span className={`uow-badge ${summary.netBalance === 0 ? "settled" : isPositive ? "positive" : "negative"}`}>
                  {summary.netBalance === 0
                    ? "Settled"
                    : isPositive
                      ? `Owes you ${formatPeso(summary.netBalance)}`
                      : `You owe ${formatPeso(summary.netBalance)}`}
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="uow-contact-items">
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <Button size="sm" variant="ghost" onClick={() => onShareContact(summary)}>
                    <Share2 size={13} /> Share Statement
                  </Button>
                  {summary.unsettledCount > 0 && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onSettleContact(summary.person)}
                    >
                      <CheckCheck size={14} /> Settle All ({summary.unsettledCount})
                    </Button>
                  )}
                </div>

                {summary.entries.map((item) => (
                  <div key={item.id} className="uow-debt-row" style={{ opacity: item.settled ? 0.62 : 1 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong style={{ fontSize: "0.9rem", textDecoration: item.settled ? "line-through" : "none" }}>
                          {item.note || (item.direction === "they_owe_me" ? "Receivable" : "Payable")}
                        </strong>
                        <span className={`uow-badge ${item.settled ? "settled" : item.direction === "they_owe_me" ? "positive" : "negative"}`}>
                          {item.direction === "they_owe_me" ? "They owe me" : "I owe them"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--uow-muted)", marginTop: "0.2rem" }}>
                        Logged {item.date}
                        {item.due_date ? ` · Due ${item.due_date}` : ""}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <strong
                        style={{
                          fontSize: "0.95rem",
                          color: item.settled
                            ? "var(--uow-muted)"
                            : item.direction === "they_owe_me"
                              ? "var(--uow-positive)"
                              : "var(--uow-negative)",
                        }}
                      >
                        {item.direction === "they_owe_me" ? "+" : "-"}
                        {formatPeso(item.amount)}
                      </strong>
                      <Button
                        size="sm"
                        variant={item.settled ? "ghost" : "secondary"}
                        onClick={() => onToggleSettled(item.id, !item.settled)}
                      >
                        <CheckCircle2 size={13} /> {item.settled ? "Reopen" : "Settle"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`Delete ${item.note || item.person}`}
                        onClick={() => onDeleteDebt(item.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
