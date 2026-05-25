/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0b10",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#00f2fe",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#8e2de2",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#4facfe",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1c25",
          foreground: "#a1a1aa",
        },
        border: "#27272a",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f2fe, 0 0 10px #00f2fe' },
          '100%': { boxShadow: '0 0 20px #00f2fe, 0 0 30px #00f2fe' },
        }
      }
    },
  },
  plugins: [],
}
