export type DebtDirection = "they_owe_me" | "i_owe_them";

export interface DebtItem {
  id: string;
  user_id?: string;
  person: string;
  amount: number;
  direction: DebtDirection;
  note: string;
  date: string;
  due_date: string | null;
  settled: boolean;
  created_at: string;
}

export interface ContactLedgerSummary {
  person: string;
  owedToMe: number;
  iOwe: number;
  netBalance: number;
  unsettledCount: number;
  entries: DebtItem[];
}
