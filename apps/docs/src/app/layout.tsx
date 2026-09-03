import type { Metadata } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ThemeProvider } from "@mono/components";
import { DocsNavbar } from "./docs-navbar";
import "./global.css";

export const metadata: Metadata = {
  title: "Machi Asia Docs",
  description: "Component library and user documentation for Machi Asia products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <DocsNavbar />
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
