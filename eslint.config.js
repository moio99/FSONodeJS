const tseslint = require("@typescript-eslint/parser");

module.exports = [
  {
    languageOptions: {
      parser: tseslint,
      ecmaVersion: 6,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "error",
      "no-fallthrough": "error",
      "no-implicit-coercion": "error",
    },
  },
];
