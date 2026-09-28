import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090D",
        surface: {
          50: "#171A26",
          100: "#1A1D2B",
          200: "#22273A",
          300: "#2D344D",
        },
        gold: {
          300: "#F7E7B4",
          400: "#E5C875",
          500: "#D4AF37",
          600: "#B89228",
          700: "#8C6C1B",
        },
        luxury: {
          dark: "#08090D",
          card: "#12141D",
          border: "#262A3C",
          text: "#E2E8F0",
          muted: "#94A3B8",
          gold: "#D4AF37",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #F7E7B4 0%, #D4AF37 50%, #B89228 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
};

export default config;
