// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tsEslint from "typescript-eslint";

/**
 * @TODO Turn on React's Rules of Hooks when it available for use with flat configs
 */

/**
 * @TODO Make sure the eslint disable directives are turned back on once the React Rules of Hooks are available
 *
 * Fine them by searching the project for `todo-eslint-disable-next-line`
 * It should be replaced with `eslint-disable-next-line react-hooks/exhaustive-deps`
 */

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  reactJsxRuntime,
  {
    ignores: ["dist/**", "node_modules/**", "src/route-tree.gen.ts", "*.html"],
  },
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
    },
  },
  eslintConfigPrettier
);
