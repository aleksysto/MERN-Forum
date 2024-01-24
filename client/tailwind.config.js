/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    borderRadius: {
      standard: "10px",
    },
    extend: {
      boxShadow: {
        standard: "0 0 7px rgb(120, 120, 120);",
        hoverbox: "0 0 9px rgb(200, 200, 200)",
      },
      colors: {
        "standard-bg": "rgb(20, 20, 20)",
        "standard-text": "rgb(207, 207, 207);",
        "hover-bg": "background-color: rgb(241, 241, 241)",
        "hover-text": "color: rgb(29, 29, 29);",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
