import type { Metadata } from "next";
import { RoseShowcase } from "./rose-showcase";

export const metadata: Metadata = {
  title: "@mono/rose Components | Machi Asia Docs",
  description: "Exported components from @mono/rose AI agent package, with live interactive demos.",
};

export default function RoseComponentsPage() {
  return <RoseShowcase />;
}
