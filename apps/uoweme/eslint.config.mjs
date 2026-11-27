import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next/**", ".next*/**", ".next_*/**", "node_modules/**", "out/**"],
  },
  ...nextConfig,
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
