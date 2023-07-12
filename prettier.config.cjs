/** @type {import("prettier").Config} */
const config = {
  // trailingComma: "all",
  // tabWidth: 2,
  // semi: true,
  // singleQuote: false,
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.cjs",
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge"],
}

module.exports = config;
