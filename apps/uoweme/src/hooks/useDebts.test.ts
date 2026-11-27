import { describe, expect, it } from "vitest";
import { summarizeDebtsByContact } from "./useDebts";
import type { DebtItem } from "@/data/types";

describe("summarizeDebtsByContact", () => {
  it("nets receivables and payables while ignoring settled records", () => {
    const sample: DebtItem[] = [
      {
        id: "1",
        person: "Alyssa Reyes",
        amount: 1450,
        direction: "they_owe_me",
        note: "Ramen",
        date: "2026-11-16",
        due_date: null,
        settled: false,
        created_at: "2026-11-16T00:00:00Z",
      },
      {
        id: "2",
        person: "Alyssa Reyes",
        amount: 420,
        direction: "i_owe_them",
        note: "Coffee",
        date: "2026-11-18",
        due_date: null,
        settled: false,
        created_at: "2026-11-18T00:00:00Z",
      },
      {
        id: "3",
        person: "Alyssa Reyes",
        amount: 5000,
        direction: "they_owe_me",
        note: "Already paid",
        date: "2026-11-01",
        due_date: null,
        settled: true,
        created_at: "2026-11-01T00:00:00Z",
      },
    ];

    const summaries = summarizeDebtsByContact(sample);
    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toMatchObject({
      person: "Alyssa Reyes",
      owedToMe: 1450,
      iOwe: 420,
      netBalance: 1030,
      unsettledCount: 2,
    });
  });
});
