/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030307',
          900: '#05050a',
          850: '#0a0a14',
          800: '#0f0f1f',
          700: '#1a1a30',
          600: '#262646',
        },
        violet: {
          accent: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        cyan: {
          accent: '#22d3ee',
          glow: 'rgba(34, 211, 238, 0.4)',
        },
        magenta: {
          accent: '#f0abfc',
          glow: 'rgba(240, 171, 252, 0.4)',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'Sora', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.8s infinite',
        'orbit': 'orbit 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.6))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'violet-glow': '0 0 20px rgba(139, 92, 246, 0.35)',
        'cyan-glow': '0 0 20px rgba(34, 211, 238, 0.35)',
        'magenta-glow': '0 0 20px rgba(240, 171, 252, 0.35)',
        'neon-hover': '0 0 25px rgba(139, 92, 246, 0.6), 0 0 10px rgba(34, 211, 238, 0.4)',
      }
    },
  },
  plugins: [],
}
