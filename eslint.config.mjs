import globals from "globals";
import pluginJs from "@eslint/js";
import tsEsLint from "typescript-eslint";
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tsEsLint.configs.recommended,
];
