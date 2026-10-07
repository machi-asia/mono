import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "asia.machi.hellsforge",
  appName: "Hell's Forge",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    OtaKit: {
      appId: "36660daa-e552-4410-9afb-fc6320b592cc",
      appReadyTimeout: 10000,
    },
  },
};

export default config;
