import type { Metadata } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";

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
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
