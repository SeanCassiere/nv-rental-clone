/* eslint @typescript-eslint/no-var-requires: "off" */
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  fontWeight: {
    // https://fonts.google.com/specimen/Source+Sans+Pro
    thin: "200",
    light: "300",
    normal: "400",
    medium: "600",
    semibold: "600",
    bold: "700",
    black: "900",
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
        serif: [...defaultTheme.fontFamily.serif],
        mono: [...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};

module.exports = config;
