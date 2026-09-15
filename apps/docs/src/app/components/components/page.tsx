import type { Metadata } from "next";
import { ComponentsShowcase } from "./components-showcase";

export const metadata: Metadata = {
  title: "@mono/components Exports",
  description: "Live interactive demos of the shared UI component library from @mono/components — design tokens, layout primitives, buttons, cards, and more.",
};

export default function ComponentsShowcasePage() {
  return <ComponentsShowcase />;
}
