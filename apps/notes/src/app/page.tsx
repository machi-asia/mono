import type { Metadata } from "next";
import { NotesWorkspace } from "@/components/notes-workspace";

export const metadata: Metadata = {
  title: "Machi Notes — Graph-Linked Markdown Workspace",
  description:
    "Write hierarchical markdown notes, connect wikilinks in a force-directed knowledge graph, and draft structured documentation with AI.",
  alternates: {
    canonical: "https://notes.machi.asia/",
  },
};

export default function NotesHomePage() {
  return <NotesWorkspace />;
}
