"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@mono/auth";
import { SEED_DEBTS } from "@/data/seed-debts";
import type { ContactLedgerSummary, DebtDirection, DebtItem } from "@/data/types";

const STORAGE_KEY = "machi_uoweme_sandbox_debts_v1";

export function summarizeDebtsByContact(debts: DebtItem[]): ContactLedgerSummary[] {
  const byPerson = new Map<string, DebtItem[]>();
  for (const debt of debts) {
    const list = byPerson.get(debt.person) ?? [];
    list.push(debt);
    byPerson.set(debt.person, list);
  }

  return Array.from(byPerson.entries())
    .map(([person, entries]) => {
      let owedToMe = 0;
      let iOwe = 0;
      let unsettledCount = 0;

      for (const item of entries) {
        if (item.settled) continue;
        unsettledCount += 1;
        if (item.direction === "they_owe_me") {
          owedToMe += item.amount;
        } else {
          iOwe += item.amount;
        }
      }

      return {
        person,
        owedToMe: Number(owedToMe.toFixed(2)),
        iOwe: Number(iOwe.toFixed(2)),
        netBalance: Number((owedToMe - iOwe).toFixed(2)),
        unsettledCount,
        entries: [...entries].sort((a, b) => b.date.localeCompare(a.date)),
      };
    })
    .sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));
}

export function useDebts() {
  const { user, isLoading: authLoading } = useAuth();
  const [debts, setDebts] = useState<DebtItem[]>(SEED_DEBTS);
  const [isUsingDemo, setIsUsingDemo] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const persistDemo = useCallback((next: DebtItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const refreshDebts = useCallback(async () => {
    if (!user) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as DebtItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDebts(parsed);
          }
        }
      } catch {
        setDebts(SEED_DEBTS);
      }
      setIsUsingDemo(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/uoweme");
      if (!res.ok) return;
      const json = (await res.json()) as { debts?: DebtItem[] };
      const cloud = json.debts ?? [];
      if (cloud.length > 0) {
        setDebts(cloud);
        setIsUsingDemo(false);
      } else {
        setDebts(SEED_DEBTS);
        setIsUsingDemo(true);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    const load = async () => {
      if (!active) return;
      await refreshDebts();
    };
    void load();
    return () => {
      active = false;
    };
  }, [authLoading, refreshDebts]);

  const addDebt = useCallback(
    async (input: {
      person: string;
      amount: number;
      direction: DebtDirection;
      note: string;
      date: string;
      due_date: string | null;
    }) => {
      if (!user) {
        const entry: DebtItem = {
          id: `demo-debt-${Date.now()}`,
          person: input.person.trim(),
          amount: Number(input.amount.toFixed(2)),
          direction: input.direction,
          note: input.note.trim(),
          date: input.date,
          due_date: input.due_date,
          settled: false,
          created_at: new Date().toISOString(),
        };
        const next = [entry, ...debts];
        setDebts(next);
        persistDemo(next);
        return entry;
      }

      const res = await fetch("/api/uoweme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { debt: DebtItem };
      setIsUsingDemo(false);
      setDebts((prev) => [data.debt, ...prev.filter((d) => !d.id.startsWith("seed-debt-"))]);
      return data.debt;
    },
    [debts, persistDemo, user]
  );

  const toggleSettled = useCallback(
    async (id: string, settled: boolean) => {
      const next = debts.map((d) => (d.id === id ? { ...d, settled } : d));
      setDebts(next);
      if (isUsingDemo || !user) {
        persistDemo(next);
        return;
      }
      await fetch(`/api/uoweme/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settled }),
      });
    },
    [debts, isUsingDemo, persistDemo, user]
  );

  const deleteDebt = useCallback(
    async (id: string) => {
      const next = debts.filter((d) => d.id !== id);
      setDebts(next);
      if (isUsingDemo || !user) {
        persistDemo(next);
        return;
      }
      await fetch(`/api/uoweme/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    [debts, isUsingDemo, persistDemo, user]
  );

  const settleContactAll = useCallback(
    async (person: string) => {
      const next = debts.map((d) =>
        d.person.toLowerCase() === person.toLowerCase() ? { ...d, settled: true } : d
      );
      setDebts(next);
      if (isUsingDemo || !user) {
        persistDemo(next);
        return;
      }
      await fetch("/api/uoweme/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person }),
      });
    },
    [debts, isUsingDemo, persistDemo, user]
  );

  const totals = useMemo(() => {
    let totalOwedToMe = 0;
    let totalIOwe = 0;
    let unsettledCount = 0;

    for (const d of debts) {
      if (d.settled) continue;
      unsettledCount += 1;
      if (d.direction === "they_owe_me") totalOwedToMe += d.amount;
      else totalIOwe += d.amount;
    }

    return {
      totalOwedToMe: Number(totalOwedToMe.toFixed(2)),
      totalIOwe: Number(totalIOwe.toFixed(2)),
      netPosition: Number((totalOwedToMe - totalIOwe).toFixed(2)),
      unsettledCount,
    };
  }, [debts]);

  const contactSummaries = useMemo(() => summarizeDebtsByContact(debts), [debts]);

  return {
    user,
    debts,
    totals,
    contactSummaries,
    isUsingDemo,
    loading,
    addDebt,
    toggleSettled,
    deleteDebt,
    settleContactAll,
  };
}
