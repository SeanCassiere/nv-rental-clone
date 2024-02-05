/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  plugins: [
    require.resolve("@ianvs/prettier-plugin-sort-imports"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  tailwindConfig: "./tailwind.config.cjs",
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge"],
  importOrder: [
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/components/(.*)$",
    "",
    "^@/lib/hooks/(.*)$",
    "^@/lib/context/(.*)$",
    "",
    "^@/lib/api/(.*)$",
    "^@/lib/schemas/(.*)$",
    "^@/lib/query/(.*)$",
    "",
    "^@/routes/(.*)$",
    "",
    "^@/lib/utils/(.*)$",
    "",
    "^@/lib/config/(.*)$",
    "",
    "^@/lib/types/(.*)$",
    "",
    "^@/(.*)$",
    "",
    "^[./-]",
    "",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
};

module.exports = config;
