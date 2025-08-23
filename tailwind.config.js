/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#57d1d6',
          50: '#f0fdfe',
          100: '#ccf7fa',
          200: '#99eff5',
          300: '#60e0ec',
          400: '#57d1d6',
          500: '#22b5c4',
          600: '#1e93a4',
          700: '#1f7585',
          800: '#21606e',
          900: '#1f505c',
          950: '#0c323e',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#0f172a',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#57d1d6',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
