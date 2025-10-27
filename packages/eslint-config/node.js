const baseConfig = require("./base");
const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = [
  ...baseConfig,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: require("eslint-plugin-import"),
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "import/order": ["error", { "newlines-between": "always" }],
    },
  },
];
