/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── India / Tiranga theme ── */
        saffron: {
          DEFAULT: '#E07B00',
          50:  '#FFF8EE',
          100: '#FFEFD0',
          200: '#FFD68A',
          300: '#FFB940',
          400: '#F59A00',
          500: '#E07B00',
          600: '#C66900',
          700: '#A35400',
          800: '#7A3E00',
          900: '#522900',
        },
        'india-green': {
          DEFAULT: '#138808',
          50:  '#EDFAEB',
          100: '#D0F2CD',
          200: '#9DE497',
          300: '#5FCF58',
          400: '#2FB529',
          500: '#138808',
          600: '#0E6E06',
          700: '#0A5405',
          800: '#063A03',
          900: '#032101',
        },
        'india-navy': '#1B2B5E',
        'india-cream': '#FFFBF5',
        'india-card': '#FFFFFF',
        /* ── existing tokens (kept for other pages) ── */
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        'accent-cyan': '#06b6d4',
        'risk-low':    '#22c55e',
        'risk-medium': '#f59e0b',
        'risk-high':   '#ef4444',
        'base-900': '#07070d',
        'base-800': '#0d0d18',
        'base-700': '#12122a',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      keyframes: {
        'aurora-drift': {
          '0%':   { transform: 'translate(0, 0) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.95)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'draw-path': {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'aurora-drift': 'aurora-drift 20s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'pulse-glow':   'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line':    'scan-line 2s linear infinite',
        'draw-path':    'draw-path 2s ease-out forwards',
        'marquee':      'marquee 30s linear infinite',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-violet':  '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-cyan':    '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-green':   '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-saffron': '0 0 20px rgba(224, 123, 0, 0.35)',
        'card-india':   '0 2px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.perspective-1000': { perspective: '1000px' },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        /* India graph-paper grid */
        '.bg-grid-india': {
          'background-image':
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          'background-size': '40px 40px',
        },
      });
    }
  ],
}
