/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0B2545',
            dark: '#071A31',
            light: '#133E75',
            surface: '#0F2C59'
          },
          green: {
            DEFAULT: '#15803D',
            dark: '#166534',
            light: '#22C55E',
            bg: '#F0FDF4'
          },
          saffron: {
            DEFAULT: '#D97706',
            dark: '#B45309',
            light: '#F59E0B',
            bg: '#FFFBEB'
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
