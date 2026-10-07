import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", ".next_*/**", "node_modules/**", "out/**", "android/**"],
  },
];

export default eslintConfig;
