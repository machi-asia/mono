import { redirect } from "next/navigation";
import { getAllArticles } from "../../../data/wiki-articles";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/docs/${slug}`);
}
