// eslint.config.js

const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig([
  // Use Expo's config
  expoConfig,

  // Your custom overrides
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      "react-native": reactNativePlugin,
    },
    rules: {
      "react-native/no-raw-text": "warn", // 👈 enables the rule
    },
  },

  {
    ignores: ["dist/*"], // You already had this
  },
]);
