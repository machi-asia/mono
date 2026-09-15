import type { Metadata } from "next";
import { AuthShowcase } from "./auth-showcase";

export const metadata: Metadata = {
  title: "@mono/auth Components",
  description: "Live interactive demos of the exported components from @mono/auth — AuthProvider, AuthGate, SignInModal. Explore authentication UI for Machi Asia apps.",
};

export default function AuthComponentsPage() {
  return <AuthShowcase />;
}
