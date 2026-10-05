import type { Metadata } from "next";
import { getAllArticles } from "../../data/wiki-articles";
import { WikiHomeClient } from "../../components/wiki/wiki-home-client";
import "../../styles/wiki.css";

export const metadata: Metadata = {
  title: "Documentation Wiki | Machi Asia",
  description:
    "Explore developer knowledge, architecture blueprints, ADRs, component manuals, and organization standards.",
};

export default async function DocsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const articles = getAllArticles();
  const params = await searchParams;
  const initialCategory = params?.category || null;

  return (
    <main>
      <WikiHomeClient
        initialArticles={articles}
        initialCategory={initialCategory}
      />
    </main>
  );
}
