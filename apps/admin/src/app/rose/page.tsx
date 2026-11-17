import type { Metadata } from "next";
import { AdminDashboard } from "../../components/admin-dashboard";

export const metadata: Metadata = {
  title: "Rose AI Monitor",
  description:
    "Inspect live Redis-stored Rose AI conversations, user and guest threads, emotion traces, and AI token quotas.",
};

export default function RoseAdminPage() {
  return <AdminDashboard siteId="rose" initialTab="rose-chats" />;
}
