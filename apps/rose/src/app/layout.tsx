import type { Metadata } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ToastProvider } from "@mono/components";

export const metadata: Metadata = {
  title: "Rose",
  description: "Custom AI agent application",
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
