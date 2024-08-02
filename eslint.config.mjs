// @ts-check
import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintReact from "eslint-plugin-react";
import eslintReactCompiler from "eslint-plugin-react-compiler";
import eslintReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**.config.{cjs,mjs,ts,js}", "postbuild.cjs"],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "**.config.{cjs,mjs,ts,js}",
      "src/**/*.gen.ts",
      "*.html",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ...eslintReact.configs.flat.recommended,
  },
  {
    languageOptions: {
      ...eslintReact.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
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
  },
  // {},
  {
    plugins: {
      "react-compiler": eslintReactCompiler,
      // @ts-expect-error
      "react-hooks": eslintReactHooks,
    },
  },
  {
    rules: {
      ...eslintReactHooks.configs.recommended.rules,
      "react-compiler/react-compiler": "error",

      "no-extra-boolean-cast": "off",
      "no-case-declarations": "off",

      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
