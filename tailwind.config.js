/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#1E293B',
        accent: '#10B981',
        background: '#F8FAFC',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      },
    },
  },
  plugins: [],
}; 