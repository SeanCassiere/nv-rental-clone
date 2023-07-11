/** @type {import("prettier").Config} */
module.exports = {
  tailwindConfig: "./styles/tailwind.config.cjs",
  tailwindFunctions: ["clsx", "cn"],
  plugins: [require("prettier-plugin-tailwindcss")],
};
