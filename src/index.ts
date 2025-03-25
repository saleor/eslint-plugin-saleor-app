import { name, version } from "../package.json";
import { loggerRules } from "./rules/logger";

const plugin = {
  meta: { name, version },
  rules: {
    "logger-leak": loggerRules,
  },
  configs: {
    recommended: {
      plugins: ["@saleor/saleor-app"],
      rules: {
        "@saleor/saleor-app/logger-leak": "error",
      },
    },
    "flat/recommended": {
      name: "saleor-app/recommended",
      rules: {
        "@saleor/saleor-app/logger-leak": "error",
      },
    },
  },
};

export const { rules, configs } = plugin;

export default plugin;
