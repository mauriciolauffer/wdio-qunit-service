import globals from "globals";
import config from "eslint-config-mlauffer-nodejs";
import tseslint from "typescript-eslint";
import wdioPlugin from "eslint-plugin-wdio";
import mochaPlugin from "eslint-plugin-mocha";

export default tseslint.config(
  {
    ignores: ["dist/", "examples/openui5-sample-app/", "**/coverage/"],
  },
  ...config,
  ...tseslint.configs.strict,
  {
    languageOptions: {
      globals: {
        ...globals.qunit
      },
    },
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off"
    }
  },
  {
    ...wdioPlugin.configs["flat/recommended"],
    files: ["examples/**/*.test.*"],
  },
  {
    ...mochaPlugin.configs.flat.recommended,
    files: ["examples/**/*.test.*"],
  }
);
