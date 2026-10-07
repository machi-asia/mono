import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next/**", ".next*/**", ".next_*/**", "node_modules/**", "out/**", "android/**"],
  },
  ...nextConfig,
  {
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
    },
  },
];

export default eslintConfig;
