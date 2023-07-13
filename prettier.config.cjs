/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.cjs",
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge"],
};

module.exports = config;
