import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182230',
        brand: { 50: '#eefbf7', 100: '#d6f5ea', 500: '#18a977', 600: '#0d8b62', 700: '#0b7051' },
      },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.04)' },
      fontFamily: { sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config
