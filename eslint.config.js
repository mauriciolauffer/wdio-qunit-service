import globals from "globals";
import config from "eslint-config-mlauffer-nodejs";
import tseslint from "typescript-eslint";
import { configs as wdioConfigs } from "eslint-plugin-wdio";
import mochaPlugin from "eslint-plugin-mocha";

config.splice(2, 1); // Remove SonarJS

export default tseslint.config(
  {
    ignores: ["dist/", "examples/openui5-sample-app*", "**/coverage/"],
  },
  ...config,
  ...tseslint.configs.strict,
  {
    languageOptions: {
      globals: {
        ...globals.qunit,
      },
    },
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
  {
    ...wdioConfigs["flat/recommended"],
    files: ["examples/**/*.test.*"],
  },
  {
    ...mochaPlugin.configs.flat.recommended,
    files: ["examples/**/*.test.*"],
  },
);
