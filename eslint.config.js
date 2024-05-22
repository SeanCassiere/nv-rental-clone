// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  reactRecommended,
  reactJsxRuntime,
  {
    ignores: ["dist/**", "node_modules/**", "src/route-tree.gen.ts"],
  },
  {
    files: ["src/**/*.{ts,tsx}", "index.html", "*.config.js", "*.config.cjs"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "jsx-a11y/img-redundant-alt": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": "off",
    },
  },
  eslintPluginPrettierRecommended,
  eslintConfigPrettier
);

const config = [
  // {
  //   ignores: ["./dist/**", "./node_modules/**", "./src/route-tree.gen.ts"],
  // },
  {
    settings: {
      react: {
        createClass: "createReactClass", // Regex for Component Factory to use,
        pragma: "React",
        fragment: "Fragment",
        version: "detect",
      },
    },
    // files: ["src/**/*.{ts,tsx}"],
    // parser: "@typescript-eslint/parser",
    // parserOptions: {
    //   project: "./tsconfig.json",
    //   ecmaFeatures: {
    //     jsx: true,
    //   },
    // },
    languageOptions: {},
    // plugins: ["react", "prettier"],
    // extends: [
    //   "plugin:react/recommended",
    //   "plugin:react/jsx-runtime",
    //   "plugin:react-hooks/recommended",
    // ],
    // rules: {
    // },
  },
];
