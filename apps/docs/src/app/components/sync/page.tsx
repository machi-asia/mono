import type { Metadata } from "next";
import { ComponentShowcase } from "@mono/components";

export const metadata: Metadata = {
  title: "@mono/sync Exports",
  description: "Exports from @mono/sync — realtime action registry, function dressing, and Redis room synchronization.",
};

export default function SyncShowcasePage() {
  return (
    <ComponentShowcase
      packageName="mono/sync"
      description="Realtime action registry, keyboard and mouse input dressing (userOnPress / userOnRelease), and Redis-backed room event synchronization for multiplayer and collaborative apps."
      components={[]}
    />
  );
}
