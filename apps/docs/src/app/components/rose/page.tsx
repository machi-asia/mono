import type { Metadata } from "next";
import { RoseShowcase } from "./rose-showcase";

export const metadata: Metadata = {
  title: "@mono/rose Components",
  description: "Live interactive demos of the Rose AI agent package components — chat UI, floating buttons, and usage bars for building your own AI companion.",
};

export default function RoseComponentsPage() {
  return <RoseShowcase />;
}
