import type { Metadata } from "next";
import { AdminDashboard } from "../components/admin-dashboard";

export const metadata: Metadata = {
  title: "Global Overview",
  description:
    "Monitor all logged-in users, guests, traffic origins, usage quotas, Rose AI Redis chats, and manage roles across Machi Asia sites.",
};

export default function AdminHomePage() {
  return <AdminDashboard siteId="all" initialTab="overview" />;
}
