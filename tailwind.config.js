/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ngat: {
          blue: '#1E5AA8',
          'blue-dark': '#143E75',
          'blue-light': '#EBF3FC',
          yellow: '#FFD100',
          'yellow-dark': '#D4AD00',
          'yellow-light': '#FFF9DB',
          charcoal: '#111827',
          gray: '#374151',
          'gray-light': '#F3F4F6',
          'gray-border': '#E5E7EB',
          correct: '#059669',
          'correct-light': '#ECFDF5',
          trap: '#DC2626',
          'trap-light': '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
