/** @type {import('eslint').Linter.Config} */
export default {
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      pragma: "React",
      fragment: "Fragment",
      version: "detect",
    },
  },
  files: ["src/**/*.{ts,tsx}"],
  ignorePatterns: ["dist/**", "node_modules/**", "src/route-tree.gen.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "jsx-a11y/img-redundant-alt": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unknown-property": "off",
  },
};
