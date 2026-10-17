/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // High-end minimalist monochrome luxury palette
        obsidian: '#09090b',
        charcoal: '#121214',
        cardDark: '#161618',
        borderDark: '#27272a',
        borderLight: '#e4e4e7',
        primary: {
          DEFAULT: '#09090b',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#27272a',
          foreground: '#f4f4f5',
        },
        muted: {
          DEFAULT: '#71717a',
          foreground: '#a1a1aa',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        elevated: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};