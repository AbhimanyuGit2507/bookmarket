/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fcfbf7',
          100: '#faf8f5',
          200: '#f3efe6',
          300: '#e7e2d7',
          400: '#d5cdbd',
          500: '#b8ad96',
        },
        brand: {
          50: '#fdf8ee',
          100: '#faedd2',
          200: '#f4daa5',
          300: '#ebc06e',
          400: '#e2a33c',
          500: '#c5811d',
          600: '#a76416',
          700: '#824916',
          800: '#6c3b17',
          900: '#5a3116',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        book: '0 8px 30px rgba(0, 0, 0, 0.07)',
        'book-hover': '0 20px 40px rgba(184, 137, 47, 0.12)',
        'elevated': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
