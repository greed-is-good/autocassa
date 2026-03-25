/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d7ebff',
          200: '#aed6ff',
          300: '#7ebcff',
          400: '#4798ff',
          500: '#1f73f2',
          600: '#1159d5',
          700: '#0f46a8',
          800: '#123b84',
          900: '#15346d',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffeed4',
          200: '#ffd9a9',
          300: '#ffbe72',
          400: '#ff9840',
          500: '#ff7a1a',
          600: '#f05d06',
          700: '#c74507',
          800: '#9e3810',
          900: '#7f3110',
        },
      },
      boxShadow: {
        panel: '0 24px 60px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'soft-grid':
          'linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
