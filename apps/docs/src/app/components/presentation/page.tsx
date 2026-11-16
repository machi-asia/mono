import type { Metadata } from "next";
import { PresentationTestingView } from "./presentation-test-view";

export const metadata: Metadata = {
  title: "Framer Motion Presentation Suite",
  description:
    "Interactive presentation and scrollytelling playground powered by Framer Motion, featuring pinned background timelines, horizontal scroll locks, portal zooms, sticky card stacks, parting shutters, and multi-layer parallax.",
};

export default function PresentationTestingPage() {
  return <PresentationTestingView />;
}
