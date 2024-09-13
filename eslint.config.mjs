import globals from "globals";
import pluginJs from "@eslint/js";
import tsEsLint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tsEsLint.configs.recommended,
  eslintConfigPrettier,
  {
    extends: ["prettier"],
  },
];
