/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        richBlack: '#080808', // Main background
        softWhite: '#F5F5F5', // Text & light sections
        luxuryGold: {
          50: '#FDFBF0',
          100: '#F9F5DB',
          200: '#F2E8B1',
          300: '#EBD984',
          400: '#E0C655',
          500: '#D4AF37', // Primary Accent
          600: '#C59F2D',
          700: '#A48020',
          800: '#7F6116',
          900: '#543F0A',
        },
        charcoal: {
          950: '#07090B',
          900: '#0E1114',
          850: '#12161A', // Card Inner Base
          800: '#181F25',
          700: '#232C35',
          600: '#34404D',
          500: '#485563', // Cards & secondary UI
          400: '#697887',
        },
        warmBrown: {
          600: '#6E4527',
          500: '#8B5E3C', // Subtle premium accent
          400: '#A4714C',
          300: '#BF8A64',
        },
        forest: {
          950: '#07090B',
          900: '#0E1114',
          850: '#12161A',
          800: '#181F25',
          700: '#232C35',
          600: '#34404D',
        },
        leaf: {
          50: '#FDFBF0',
          100: '#F9F5DB',
          200: '#F2E8B1',
          300: '#EBD984',
          400: '#E0C655',
          500: '#D4AF37',
          600: '#C59F2D',
          700: '#A48020',
          800: '#7F6116',
          900: '#543F0A',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5F5F5',
          300: '#E5E5E5',
          400: '#D4AF37',
          500: '#8B5E3C',
        },
        themeGray: {
          300: '#697887',
          400: '#485563',
          500: '#34404D',
          600: '#232C35',
        },
        electric: {
          cyan: '#D4AF37',
          blue: '#C59F2D',
          amber: '#F5F5F5',
          gold: '#D4AF37',
          crimson: '#8B5E3C',
          emerald: '#D4AF37'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
