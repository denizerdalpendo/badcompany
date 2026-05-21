import colors from 'tailwindcss/colors';

// Remap every accent color to a true neutral so the entire UI renders
// monochrome (black/gray scale) without any blue tint, in both light
// and dark modes.
const mono = colors.neutral;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.jsx",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '2px',
      DEFAULT: '2px',
      md: '2px',
      lg: '2px',
      xl: '2px',
      '2xl': '2px',
      '3xl': '2px',
      full: '9999px',
    },
    // Every named text size shrunk by 1px from the Tailwind defaults
    fontSize: {
      xs: ['11px', { lineHeight: '1rem' }],
      sm: ['13px', { lineHeight: '1.25rem' }],
      base: ['15px', { lineHeight: '1.5rem' }],
      lg: ['17px', { lineHeight: '1.75rem' }],
      xl: ['19px', { lineHeight: '1.75rem' }],
      '2xl': ['23px', { lineHeight: '2rem' }],
      '3xl': ['29px', { lineHeight: '2.25rem' }],
      '4xl': ['35px', { lineHeight: '2.5rem' }],
      '5xl': ['47px', { lineHeight: '1' }],
      '6xl': ['59px', { lineHeight: '1' }],
      '7xl': ['71px', { lineHeight: '1' }],
      '8xl': ['95px', { lineHeight: '1' }],
      '9xl': ['127px', { lineHeight: '1' }],
    },
    extend: {
      fontFamily: {
        sans: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        slate: mono,
        gray: mono,
        zinc: mono,
        stone: mono,
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
