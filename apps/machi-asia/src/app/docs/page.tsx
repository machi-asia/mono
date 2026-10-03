import { redirect } from "next/navigation";

export default function DocsRedirectPage() {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3000";
  redirect(docsUrl);
}
