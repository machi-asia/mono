import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
} from "../../../data/wiki-articles";
import { WikiArticleView } from "../../../components/wiki/wiki-article-view";
import "../../../styles/wiki.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Machi Asia Docs",
    };
  }

  return {
    title: `${article.title} | Machi Asia Docs`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

export default async function WikiArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(article.category);
  const relatedArticles = categoryArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <main>
      <WikiArticleView
        article={article}
        relatedArticles={relatedArticles}
      />
    </main>
  );
}
