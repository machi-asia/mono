import type { Metadata } from "next";
import { getAllArticles } from "../../data/wiki-articles";
import { WikiHomeClient } from "../../components/wiki/wiki-home-client";
import "../../styles/wiki.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Documentation Wiki | Machi Asia",
  description:
    "Explore developer knowledge, architecture blueprints, ADRs, component manuals, and organization standards.",
};

export default function DocsPage() {
  const articles = getAllArticles();

  return (
    <main>
      <WikiHomeClient initialArticles={articles} />
    </main>
  );
}
