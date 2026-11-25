/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#0d130e',
          light: '#1b2c1d',
          line: '#3a593e',
          accent: '#22c55e'
        },
        card: {
          dark: '#12141a',
          hover: '#1a1d26',
          border: '#262a36'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
