import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "asia.machi.calculator",
  appName: "Machi Calculator",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    OtaKit: {
      appId: "bcbdb078-9e02-4744-98dd-44afd20505c4",
      appReadyTimeout: 10000,
    },
  },
};

export default config;
