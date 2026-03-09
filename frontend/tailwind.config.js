/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#A17A5C", // Lightened primary
          500: "#8B5E3C", // Primary (warm brown)
          600: "#5F3717", // Darkened primary
        },
        cream: {
          50: "#FAF9F6",  // Background
          100: "#F5EBDD", // Secondary (cream)
          200: "#E8D5C4", // Darker cream for borders/hover
        },
        accent: {
          400: "#D4A956",
          500: "#C89B3C", // Accent (gold)
          600: "#B8860B",
        },
        dark: {
          900: "#2E2E2E", // Dark text/elements
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};

