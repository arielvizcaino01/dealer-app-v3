import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b1020',
        panel: '#121a2f',
        border: '#24304a',
        accent: '#4f46e5',
        soft: '#93c5fd',
      },
    },
  },
  plugins: [],
} satisfies Config;
