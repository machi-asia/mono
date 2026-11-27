import type { Metadata, Viewport } from "next";
import { MonoAppShell } from "@mono/auth";
import "leaflet/dist/leaflet.css";
import "./terraprice.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://terraprice.machi.asia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TerraPrice — Regional Food Price Predictor",
    template: "%s | TerraPrice",
  },
  description:
    "Machine-learning agricultural commodity price forecaster for the Philippines. Predict retail and wholesale food prices by geographic location using a 4-layer neural network and regional market datasets.",
  keywords: [
    "TerraPrice",
    "food price prediction",
    "agricultural commodity prices",
    "Philippines food prices",
    "crop price forecasting",
    "neural network price estimator",
    "retail wholesale commodity prices",
    "machi asia",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "TerraPrice",
    title: "TerraPrice — Regional Food Price Predictor",
    description:
      "Machine-learning agricultural commodity price forecaster for the Philippines using geographic coordinates and regional datasets.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "TerraPrice" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraPrice — Regional Food Price Predictor",
    description:
      "Machine-learning agricultural commodity price forecaster for the Philippines using geographic coordinates and regional datasets.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#2d5a3d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MonoAppShell defaultTheme="light">{children}</MonoAppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TerraPrice",
              url: SITE_URL,
              description:
                "Regional agricultural food price forecasting platform powered by a TypeScript neural network and Philippines market datasets.",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </body>
    </html>
  );
}
