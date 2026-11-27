import type { Metadata } from "next";
import { UOweMeDashboard } from "@/components/uoweme-dashboard";

export const metadata: Metadata = {
  title: "U Owe Me — Peer IOU Ledger & Expense Settlement",
  description:
    "Track who owes whom, consolidate multi-item splits into single contact balances, and generate shareable settlement statements.",
  alternates: {
    canonical: "https://uoweme.machi.asia/",
  },
};

export default function UOweMeHomePage() {
  return <UOweMeDashboard />;
}
