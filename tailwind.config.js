/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F2F",
        primary: "#1E2A78",
        accent: "#2AF5FF",
        textLight: "#E0E6F1",
        card: "#11193F",
      },
      fontFamily: {
        sans: ['Rajdhani', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        neon: "0 0 15px #2AF5FF66",
        insetNeon: "inset 0 0 10px #2AF5FF44",
      },
    },
  },
  plugins: [],
}
