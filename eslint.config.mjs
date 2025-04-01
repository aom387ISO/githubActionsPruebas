import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  [globalIgnores(["**/test.js", "**/buzz.min.js", "**/jquery-3.1.1.min.js"])],
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
]);