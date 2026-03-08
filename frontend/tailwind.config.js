/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#A17A5C",
          500: "#8B5E3C",
          600: "#5F3717",
        },
        cream: {
          50: "#F8F4EF",
          100: "#F0EADF",
        },
      },
    },
  },
  plugins: [],
};

