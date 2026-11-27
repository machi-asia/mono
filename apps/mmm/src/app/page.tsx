import type { Metadata } from "next";
import { MmmDashboard } from "@/components/mmm-dashboard";

export const metadata: Metadata = {
  title: "Minecraft Mod Manager — Synchronized Modpacks & Dependency Checker",
  description:
    "Create shared Minecraft modpack organizations, browse Modrinth releases, match local mods folders, and inspect modpack changelogs in real time.",
  alternates: {
    canonical: "https://mmm.machi.asia/",
  },
};

export default function MmmHomePage() {
  return <MmmDashboard />;
}
