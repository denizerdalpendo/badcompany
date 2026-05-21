import colors from 'tailwindcss/colors';

// Remap every accent color to slate so the entire UI renders monochrome
// without having to touch individual class names across the app.
const mono = colors.slate;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        violet: mono,
        indigo: mono,
        purple: mono,
        fuchsia: mono,
        pink: mono,
        rose: mono,
        red: mono,
        orange: mono,
        amber: mono,
        yellow: mono,
        lime: mono,
        green: mono,
        emerald: mono,
        teal: mono,
        cyan: mono,
        sky: mono,
        blue: mono,
      },
    },
  },
  plugins: [],
}
