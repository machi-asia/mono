import type { Metadata } from "next";
import { getAllArticles } from "../data/wiki-articles";
import { WikiHomeClient } from "../components/wiki/wiki-home-client";
import "../styles/wiki.css";

export const metadata: Metadata = {
  title: "Documentation Wiki | Machi Asia",
  description:
    "Developer knowledge base, architecture specifications, ADRs, and package documentation for the Machi Asia platform.",
};

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <main>
      <WikiHomeClient initialArticles={articles} />
    </main>
  );
}
