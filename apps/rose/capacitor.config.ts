import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "asia.machi.rose",
  appName: "Rose AI",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    OtaKit: {
      appId: "717836e1-e934-42de-b027-0a5061173bcb",
      appReadyTimeout: 10000,
    },
  },
};

export default config;
