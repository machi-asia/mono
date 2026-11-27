import type { Metadata } from "next";
import { TerraPriceDashboard } from "../components/terraprice-dashboard";

export const metadata: Metadata = {
  title: "Agricultural Commodity Price Predictor",
  description:
    "Interactive Philippines agricultural price forecaster and dataset manager powered by a 4-layer neural network.",
};

export default function HomePage() {
  return <TerraPriceDashboard />;
}
