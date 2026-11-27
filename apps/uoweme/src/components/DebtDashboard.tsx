"use client";

import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

interface DebtDashboardProps {
  totalOwedToMe: number;
  totalIOwe: number;
  netPosition: number;
  unsettledCount: number;
}

export function formatPeso(amount: number): string {
  return `₱${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function DebtDashboard({
  totalOwedToMe,
  totalIOwe,
  netPosition,
  unsettledCount,
}: DebtDashboardProps) {
  return (
    <section className="uow-summary-grid" aria-label="Ledger summary totals">
      <div className="uow-stat-card positive">
        <div className="uow-stat-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ArrowDownLeft size={14} style={{ color: "var(--uow-positive)" }} /> Owed To You
        </div>
        <div className="uow-stat-value" style={{ color: "var(--uow-positive)" }}>
          {formatPeso(totalOwedToMe)}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--uow-muted)", marginTop: "0.25rem" }}>
          Receivables across open entries
        </div>
      </div>

      <div className="uow-stat-card negative">
        <div className="uow-stat-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ArrowUpRight size={14} style={{ color: "var(--uow-negative)" }} /> You Owe Others
        </div>
        <div className="uow-stat-value" style={{ color: "var(--uow-negative)" }}>
          {formatPeso(totalIOwe)}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--uow-muted)", marginTop: "0.25rem" }}>
          Pending outbound settlements
        </div>
      </div>

      <div className="uow-stat-card net">
        <div className="uow-stat-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Wallet size={14} style={{ color: "var(--uow-accent-light)" }} /> Net Balance
        </div>
        <div className="uow-stat-value">
          {netPosition >= 0 ? "+" : "-"}
          {formatPeso(netPosition)}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--uow-muted)", marginTop: "0.25rem" }}>
          {unsettledCount} open ledger entry(s)
        </div>
      </div>
    </section>
  );
}
