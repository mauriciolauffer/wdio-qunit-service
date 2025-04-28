import globals from "globals";
import config from "eslint-config-mlauffer-nodejs";
import tseslint from "typescript-eslint";
import { configs as wdioConfigs } from "eslint-plugin-wdio";
import mochaPlugin from "eslint-plugin-mocha";

export default tseslint.config(
  {
    ignores: ["dist/", "examples/openui5-sample-app*", "**/coverage/"],
  },
  {
    extends: [config, tseslint.configs.strict],
    languageOptions: {
      globals: {
        ...globals.qunit,
      },
    },
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "sonarjs/todo-tag": "warn",
      "sonarjs/no-skipped-tests": "warn",
    },
  },
  {
    files: ["examples/**/*.test.*"],
    extends: [wdioConfigs["flat/recommended"]],
  },
  {
    files: ["examples/**/*.test.*"],
    extends: [mochaPlugin.configs.recommended],
  },
);
