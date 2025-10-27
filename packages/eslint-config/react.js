const nodeConfig = require("./node");
const globals = require("globals");

module.exports = [
  ...nodeConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+ doesn't need React import
      "react/prop-types": "off", // When using TypeScript
    },
  },
];
