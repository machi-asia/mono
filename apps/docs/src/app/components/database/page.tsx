import type { Metadata } from "next";
import { ComponentShowcase } from "@mono/components";

export const metadata: Metadata = {
  title: "@mono/database Exports",
  description: "Exports from @mono/database — the centralized Supabase-backed data and store layer for Machi Asia apps.",
};

export default function DatabaseShowcasePage() {
  return (
    <ComponentShowcase
      packageName="mono/database"
      description="Centralized data/store package powered by Supabase Database and Storage. @mono/database currently exports only client and type factories, not UI components — so its showcase list is empty. If UI components are ever added here, list them in this array."
      components={[]}
    />
  );
}
