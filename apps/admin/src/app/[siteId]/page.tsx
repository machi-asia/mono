import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDashboard } from "../../components/admin-dashboard";
import { getSiteAdminMeta, SITE_ADMIN_REGISTRY } from "../../lib/site-registry";

export async function generateStaticParams() {
  return SITE_ADMIN_REGISTRY.filter(
    (site) => site.id !== "rose" && site.id !== "itemlist"
  ).map((site) => ({ siteId: site.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ siteId: string }>;
}): Promise<Metadata> {
  const { siteId } = await params;
  const site = getSiteAdminMeta(siteId);
  if (!site) {
    return {
      title: "Site Not Found",
    };
  }

  return {
    title: `${site.name} Admin`,
    description: `Monitor active users, guests, traffic origins, usage quotas, and support tickets for ${site.name} (${site.domain}).`,
  };
}

export default async function SiteAdminPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = getSiteAdminMeta(siteId);

  if (!site) {
    notFound();
  }

  return <AdminDashboard siteId={site.id} initialTab="overview" />;
}
