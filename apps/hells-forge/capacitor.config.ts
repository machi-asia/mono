import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "asia.machi.hellsforge",
  appName: "Hell's Forge",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      resetWhenUpdate: false,
      defaultChannel: "production",
    },
  },
};

export default config;
