import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Ignorar archivos específicos globalmente
  [globalIgnores(["**/test.js", "**/buzz.min.js", "**/jquery-3.1.1.min.js"])],

  // Configuración para todos los archivos JavaScript y TypeScript
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser, // Define los globals del entorno del navegador
    },
  },

  // Configuración recomendada para TypeScript
  tseslint.configs.recommended,

  // Reglas personalizadas
  {
    rules: {
      // Cambiar la regla de no-unused-vars para que sea una advertencia
      "@typescript-eslint/no-unused-vars": [
        "warn", // Cambia a "warn" para que no bloquee el pipeline
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }, // Ignora variables que comiencen con "_"
      ],
    },
  },
]);