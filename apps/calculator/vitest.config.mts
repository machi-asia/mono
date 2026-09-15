import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const rawXmlPlugin = {
  name: "vite-raw-xml-plugin",
  transform(src: string, id: string) {
    if (id.endsWith(".xml")) {
      return {
        code: `export default ${JSON.stringify(src)};`,
        map: null,
      };
    }
  },
};

export default defineConfig({
  plugins: [react(), rawXmlPlugin],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    css: true,
  },
});
