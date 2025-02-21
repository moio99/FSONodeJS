import globals from "globals";
import jsStylistic from "@stylistic/eslint-plugin-js"


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {sourceType: "script"},
    ignores: ["node_modules", "dist"],
    plugins: { "@stylistic/js": jsStylistic },
    rules: {
      "no-trailing-spaces": "warn", // Espaços ao final das linhas
      "@stylistic/js/quotes": ["error", "single"],  // cominhas simples em vez das "
      "@stylistic/js/semi": ["error", "never"]  // nom finalizar com ";"
    },
  },
  {languageOptions: { globals: globals.browser }},
];