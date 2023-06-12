import { loggerRules } from "./rules/logger";

export const rules = {
  "logger-leak": loggerRules,
};

export const configs = {
  recommended: {
    plugins: ["@saleor/saleor-app"],
    rules: {
      "@saleor/saleor-app/logger-leak": "error",
    },
  },
};
