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
          500: '#0a1e3c',
          700: '#1e4a7a',
        },
        background: '#f4f7fc',
        success: '#2e7d32',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}