import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { MonoAppShell } from "@mono/auth";
import { RoseChatModalFloatingButton, RoseChatModal, RoseChatModalProvider } from "@mono/rose";
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
          <MonoAppShell>
            <RoseChatModalProvider>
              <SmoothScroll />
              {children}
              <RoseChatModalFloatingButton ariaLabel="Open Rose AI Agent" />
              <RoseChatModal />
            </RoseChatModalProvider>
          </MonoAppShell>
        </MotionConfig>
      </body>
    </html>
  );
}
