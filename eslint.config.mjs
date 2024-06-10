// @ts-check
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactCompiler from "eslint-plugin-react-compiler";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tsEslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: eslintJs.configs.recommended,
  allConfig: eslintJs.configs.all,
});

export default tsEslint.config(
  eslintJs.configs.recommended,
  ...tsEslint.configs.recommended,
  reactJsxRuntime,
  {
    ignores: ["dist/**", "node_modules/**", "src/route-tree.gen.ts", "*.html"],
  },
  ...fixupConfigRules(compat.extends("plugin:react-hooks/recommended")),
  {
    files: ["src/**/*.{ts,tsx}", "*.config.js", "*.config.cjs"],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        // project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        createClass: "createReactClass",
        pragma: "React",
        fragment: "Fragment",
        version: "detect",
      },
    },
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "no-extra-boolean-cast": "off",
      "no-case-declarations": "off",
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
      "react-compiler/react-compiler": "error",
    },
  },
  eslintConfigPrettier
);
