import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "asia.machi.docs",
  appName: "Machi Docs",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    OtaKit: {
      appId: "b4cb8036-75d2-45f1-ac52-3de7904869b3",
      appReadyTimeout: 10000,
    },
  },
};

export default config;
