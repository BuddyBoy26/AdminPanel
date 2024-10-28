/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'custom-orange': '#FF9321',
        'custom-dark': '#1f1f1f',
        'custom-darker': '#151515',
        'custom-darkest': '#101010',
      },
      textColor: {
        'custom-orange': '#FF9321',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
