"use client";

import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@mono/components";
import type { DebtDirection } from "@/data/types";

interface AddDebtDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: {
    person: string;
    amount: number;
    direction: DebtDirection;
    note: string;
    date: string;
    due_date: string | null;
  }) => Promise<unknown>;
}

export function AddDebtDialog({ isOpen, onClose, onAdd }: AddDebtDialogProps) {
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<DebtDirection>("they_owe_me");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!person.trim() || !Number.isFinite(numeric) || numeric <= 0) return;

    setSubmitting(true);
    await onAdd({
      person: person.trim(),
      amount: numeric,
      direction,
      note: note.trim(),
      date,
      due_date: dueDate || null,
    });
    setSubmitting(false);
    setPerson("");
    setAmount("");
    setNote("");
    setDueDate("");
    onClose();
  };

  return (
    <div className="uow-modal-backdrop" role="dialog" aria-modal="true" aria-label="Add IOU Entry">
      <div className="uow-modal-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Plus size={18} style={{ color: "var(--uow-accent-light)" }} /> Log New IOU Entry
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: "transparent", border: "none", color: "var(--uow-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div className="uow-pill-tabs" style={{ width: "100%" }}>
            <button
              type="button"
              className={`uow-pill-tab ${direction === "they_owe_me" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setDirection("they_owe_me")}
            >
              They Owe Me
            </button>
            <button
              type="button"
              className={`uow-pill-tab ${direction === "i_owe_them" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setDirection("i_owe_them")}
            >
              I Owe Them
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "0.75rem" }}>
            <input
              type="text"
              className="uow-input"
              placeholder="Contact name or email"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              min="1"
              className="uow-input"
              placeholder="Amount (₱)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            className="uow-input"
            placeholder="Reason / receipt memo (e.g. Dinner split)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--uow-muted)", marginBottom: "0.25rem" }}>
                Date
              </label>
              <input
                type="date"
                className="uow-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--uow-muted)", marginBottom: "0.25rem" }}>
                Due Date (optional)
              </label>
              <input
                type="date"
                className="uow-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem", marginTop: "0.25rem" }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
