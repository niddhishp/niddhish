import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        '#0a0a0a',
        surface1:  '#121212',
        surface2:  '#161616',
        accent:    '#d85a30',
        'bg-light':'#f8f6f1',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
