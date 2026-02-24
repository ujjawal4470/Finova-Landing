/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          hover: "#172554",
          light: "#EFF6FF",
        },
        secondary: {
          DEFAULT: "#FF9874",
          hover: "#E87C55",
          light: "#FFF0EB",
        },
        accent: {
          DEFAULT: "#2DD4BF",
          hover: "#14B8A6",
        },
        background: "#F8FAFC", // <-- MUST BE HERE inside colors!
      }
    },
  },
  plugins: [],
}