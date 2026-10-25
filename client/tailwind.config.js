/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7ee',
          100: '#f5edd4',
          200: '#ebd9a8',
          300: '#dec075',
          400: '#d1a547',
          500: '#b8892f',
          600: '#946924',
          700: '#734e1f',
          800: '#5c3e1c',
          900: '#4c3319',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
