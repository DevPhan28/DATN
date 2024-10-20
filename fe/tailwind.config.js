/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    './node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },

  presets: [require('@medusajs/ui-preset')],
  plugins: [],
};
