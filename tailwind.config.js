/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-bg": "#f9f6e3",
        "custom-accent": "#601915",
        "custom-accent-light": "#9e2d27",
      },
      width: {
        "32-percent": "32%",
      },
    },
  },
  plugins: [],
};
