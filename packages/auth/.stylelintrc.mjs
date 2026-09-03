/** @type {import('stylelint').Config} */
const stylelintConfig = {
  extends: "stylelint-config-standard",
  rules: {
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "value-keyword-case": null,
  },
};

export default stylelintConfig;
