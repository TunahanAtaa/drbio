/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'clay-card': 'inset -6px -6px 12px rgba(0,0,0,0.03), inset 6px 6px 12px rgba(255,255,255,0.9), 10px 16px 32px rgba(153,27,27,0.04)',
        'clay-btn': 'inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.3), 4px 6px 12px rgba(153,27,27,0.2)',
        'clay-card-dark': 'inset -6px -6px 12px rgba(0,0,0,0.4), inset 4px 4px 8px rgba(255,255,255,0.05), 10px 16px 32px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}
