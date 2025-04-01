const tseslint = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: ["**/build/**", "**/node_modules/**"],
    languageOptions: {
      parser: tseslint,
      ecmaVersion: 6,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "error",
      "no-fallthrough": "error",
      "no-implicit-coercion": "error","curly": "error", // Exige chaves em todas as estruturas de controle (if, loops)
      "eqeqeq": ["error", "always"], // Exige === em vez de ==
      "no-alert": "warn", // Evita alert, confirm e prompt
      "no-else-return": "error", // Evita else desnecessários se já houver um return antes
      "no-param-reassign": "error", // Evita modificar parâmetros de funçons
      "prefer-const": "error", // Prefere const em vez de let quando a variável nom muda
      "no-shadow": "error", // Evita que variáveis internas escondam variáveis externas
      "indent": ["error", 2], // Define indentação de 2 espaços
      // "quotes": ["error", "double"], // Exige o uso de aspas duplas
      "semi": ["error", "always"], // Obriga o uso de ponto e vírgula
      "space-before-function-paren": ["error", "never"], // Regras de espaçamento em funções
      "comma-dangle": ["error", "always-multiline"], // Exige vírgula final em objetos e arrays multilinha
    },
  },
];