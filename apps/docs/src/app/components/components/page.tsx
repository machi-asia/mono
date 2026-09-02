import type { Metadata } from "next";
import { ComponentsShowcase } from "./components-showcase";

export const metadata: Metadata = {
  title: "@mono/components Exports | Machi Asia Docs",
  description: "Exported components from @mono/components, listed via the shared showcase layout with live interactive demos",
};

export default function ComponentsShowcasePage() {
  return <ComponentsShowcase />;
}
