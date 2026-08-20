/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nero: 'rgba(37, 37, 37, 1)',
        bookme: {
          tan: '#c49c74',
          dark: '#1c1c1c',
          darker: '#252525',
          light: '#f0efef',
          cream: '#f6f6f6',
          gray: '#cccccc',
          muted: '#a1a7b0',
          soft: '#c9beb3',
        },
      },
      fontFamily: {
        display: ['SF Pro Display', 'Helvetica', 'sans-serif'],
        sans: ['Manrope', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
