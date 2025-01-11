/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          dark: '#0A1323',
          darker: '#1A2333',
        }
      }
    },
  },
  plugins: [],
}