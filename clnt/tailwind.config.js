/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          lightest: "#fdfdfe",
          light: "#f0f3f5",
          medium: "#d6d9df",
          border: "#bdc2c7",
          text: "#8f9192",
          primary: "#3d766d",
        },
      },
    },
  },
  plugins: [],
};
