/** @type {import('tailwindcss').Config} */
const path = require("path");

module.exports = {
  content: [
    path.join(__dirname, "index.ejs"),
    path.join(__dirname, "../public/user/js/main.js"),
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8f1",
          100: "#dcefe1",
          200: "#bee2c9",
          300: "#91cfaa",
          500: "#149448",
          600: "#09853b",
          700: "#087032",
          900: "#173b27",
        },
        canvas: "#f5f7f5",
        ink: "#1d2721",
        muted: "#758078",
        line: "#e8ece8",
        sunny: "#f5c744",
      },
      boxShadow: {
        card: "0 8px 24px rgba(31, 48, 36, 0.055)",
        float: "0 18px 44px rgba(24, 40, 29, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

