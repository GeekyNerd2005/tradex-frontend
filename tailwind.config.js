module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // this is crucial for CRA
  ],
  theme: {
 extend: {
  animation: {
    blink: 'blink 1s step-start infinite',
  },
  keyframes: {
    blink: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0 },
    },
  },
},
},

  plugins: [],
};
