/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0f1015',
        bgSecondary: '#16181f',
        bgCard: '#1a1d26',
        cardHover: '#1e222d',
        textPrimary: '#e2e8f0',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        accentNavy: '#1e3a8a',
        accentPurple: '#7c3aed',
        accentBeige: '#d4d4d8',
        neonPurple: '#a78bfa',
        neonBlue: '#60a5fa',
        neonGreen: '#34d399',
        neonOrange: '#fbbf24',
        neonPink: '#f472b6'
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/notebook.png')",
      }
    },
  },
  plugins: [],
}
