/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      heading: ["Unbounded", "cursive"],
    },
  },

  extend: {
    animation: {
      fadeInUp: "fadeInUp 0.3s ease-out",
    },
    keyframes: {
      fadeInUp: {
        "0%": { opacity: 0, transform: "translateY(20px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
    },
  },

  plugins: [],
};
