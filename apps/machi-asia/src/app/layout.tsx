import type { Metadata } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";

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
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
