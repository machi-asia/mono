import type { Metadata } from "next";
import { SectionsTestingView } from "./sections-test-view";

export const metadata: Metadata = {
  title: "Scroll Section Testing Ground | @mono/components",
  description: "Dedicated interactive testing playground for full-viewport scroll mechanics, including Horizontal Scroll, Sticky Card Stack, Split Curtain, Parallax Depth, and Dynamic Zoom Focus.",
};

export default function SectionsTestingPage() {
  return <SectionsTestingView />;
}
