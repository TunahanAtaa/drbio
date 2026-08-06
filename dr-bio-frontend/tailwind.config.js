/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#dc2626',
          900: '#991b1b',
        }
      },
      boxShadow: {
        'saas-card': 'inset -6px -6px 12px rgba(0,0,0,0.03), inset 6px 6px 12px rgba(255,255,255,0.9), 10px 16px 32px rgba(220,38,38,0.06)',
        'saas-btn': 'inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.3), 4px 6px 12px rgba(220,38,38,0.25)',
        'clay-card': 'inset -6px -6px 12px rgba(0,0,0,0.03), inset 6px 6px 12px rgba(255,255,255,0.9), 10px 16px 32px rgba(220,38,38,0.06)',
        'clay-btn': 'inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.3), 4px 6px 12px rgba(220,38,38,0.25)',
        'clay-card-dark': 'inset -6px -6px 12px rgba(0,0,0,0.4), inset 6px 6px 12px rgba(255,255,255,0.05), 10px 16px 32px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}
