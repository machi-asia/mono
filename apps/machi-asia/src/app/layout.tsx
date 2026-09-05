import type { Metadata } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ToastProvider } from "@mono/components";

export const metadata: Metadata = {
  title: "Machi Asia",
  description: "Showcase and subscription billing hub for Machi Asia products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <AuthProvider>
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
