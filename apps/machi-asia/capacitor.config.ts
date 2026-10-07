import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "asia.machi.portal",
  appName: "Machi Asia",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    OtaKit: {
      appId: "3ad8cf40-58d9-4124-b82a-079df5524596",
      appReadyTimeout: 10000,
    },
  },
};

export default config;
