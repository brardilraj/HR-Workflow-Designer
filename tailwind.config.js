/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0d1117',
          secondary: '#161b22',
          panel:     '#1c2230',
          hover:     '#212a3e',
        },
        brand: {
          indigo:  '#6366f1',
          'indigo-light': '#818cf8',
          violet:  '#8b5cf6',
          emerald: '#10b981',
          amber:   '#f59e0b',
          rose:    '#f43f5e',
          sky:     '#38bdf8',
        },
        border: {
          subtle: 'rgba(99,120,171,0.18)',
          medium: 'rgba(99,120,171,0.32)',
        },
        text: {
          primary:   '#e6edf3',
          secondary: '#8b949e',
          muted:     '#4d5566',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        node:  '0 4px 20px rgba(0,0,0,0.4)',
        panel: '0 8px 32px rgba(0,0,0,0.48)',
        glow:  '0 0 20px rgba(99,102,241,0.35)',
        'glow-emerald': '0 0 16px rgba(16,185,129,0.3)',
        'glow-rose':    '0 0 16px rgba(244,63,94,0.3)',
      },
      borderRadius: {
        node:  '12px',
        panel: '14px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 1.5s linear infinite',
        'slide-in':   'slideIn 0.25s ease both',
        'fade-up':    'fadeUp 0.3s ease both',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}