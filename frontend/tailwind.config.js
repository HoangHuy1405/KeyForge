/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#fbc02d', // main yellow
        secondary: '#f57f17', // deep yellow
        background: {
          DEFAULT: '#fffde7', // default background
          paper: '#fff9c4', // paper-like bg
        },
        text: {
          primary: '#212121',
          secondary: '#5f5f5f',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // MUI button radius = 12px → Tailwind rounded-xl (0.75rem)
      borderRadius: {
        xl: '0.75rem',
      },
      // Optional: heading sizes to match h1 = 2rem
      fontSize: {
        h1: ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
