/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // This tells Tailwind to look for a 'dark' class on the HTML root
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Edit these hex codes to match your specific brand identity
        brand: {
          light: '#e0f2fe',
          DEFAULT: '#0ea5e9', // Main brand color (e.g., ocean blue)
          dark: '#0284c7',
        },
        // Custom background colors for seamless toggling
        surface: {
          light: '#f8fafc', // slate-50
          dark: '#0f172a',  // slate-900
        },
        card: {
          light: '#ffffff',
          dark: '#1e293b',  // slate-800
        }
      }
    },
  },
  plugins: [],
}