import type { Metadata } from "next";
import { AuthShowcase } from "./auth-showcase";

export const metadata: Metadata = {
  title: "@mono/auth Components | Machi Asia Docs",
  description: "Exported components from @mono/auth, listed via the shared showcase layout with live interactive demos",
};

export default function AuthComponentsPage() {
  return <AuthShowcase />;
}
