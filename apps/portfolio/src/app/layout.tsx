import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "@mono/auth";
import { ThemeProvider, ToastProvider, OtaUpdateNotifier } from "@mono/components";
import SmoothScroll from "../components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angelo Justine D. Kamachi — Full-Stack Software Engineer",
  description:
    "Interactive portfolio of Angelo Justine D. Kamachi. Explore featured machine learning projects, enterprise full-stack experience, and technical skill graph.",
  keywords: [
    "Angelo Justine D. Kamachi",
    "Portfolio",
    "Full-Stack Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "Machine Learning",
  ],
  authors: [{ name: "Angelo Justine D. Kamachi", url: "https://github.com/kamachi-dev" }],
  openGraph: {
    title: "Angelo Justine D. Kamachi — Portfolio",
    description: "Full-Stack Software Engineer specializing in interactive web architectures and AI systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="portfolio-app">
        <MotionConfig reducedMotion="never">
          <ThemeProvider>
            <SmoothScroll />
            <OtaUpdateNotifier />
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
