/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forensic: {
          bg: '#f4f6f9',
          card: '#ffffff',
          border: '#e2e8f0',
          darkBorder: '#cbd5e1',
          navy: '#0f172a',
          blue: '#1d4ed8',
          accent: '#2563eb',
          sky: '#0284c7',
          lightBlue: '#eff6ff',
          red: '#dc2626',
          green: '#16a34a',
          yellow: '#d97706',
          slate: '#475569',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
