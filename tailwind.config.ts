import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        naka: {
          orange: '#FF4D00',
          red: '#FF0000',
        },
        neon: {
          cyan: '#00ffff',
          blue: '#0080ff',
          pink: '#ff00ff',
          magenta: '#ff0080',
        },
        glow: {
          yellow: '#ffed4e',
          green: '#00ff88',
          blue: '#00b4ff',
        },
      },
      fontFamily: {
        handwritten: ['var(--font-permanent-marker)', 'cursive'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        jp: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
      boxShadow: {
        'naka-glow': '0 0 20px rgba(255, 77, 0, 0.6)',
        'naka-glow-intense': '0 0 30px rgba(255, 77, 0, 0.8)',
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.6)',
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.6)',
      },
      animation: {
        'gradient-shift': 'gradientShift 3s ease infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
