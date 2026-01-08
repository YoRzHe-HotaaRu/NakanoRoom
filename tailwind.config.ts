import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base theme colors - Cherry Blossom inspired
        sakura: {
          50: '#FFF5F8',
          100: '#FFEBF0',
          200: '#FFD6E0',
          300: '#FFB8CA',
          400: '#FF8FAB',
          500: '#FF6B8A',
          600: '#E84A6F',
          700: '#C72D52',
          800: '#A31D3F',
          900: '#7A1530',
        },
        // Character accent colors
        ichika: {
          DEFAULT: '#F8A5C2',
          dark: '#E08AAB',
          light: '#FFD0E0',
        },
        nino: {
          DEFAULT: '#E056A0',
          dark: '#C23D85',
          light: '#F598C8',
        },
        miku: {
          DEFAULT: '#5B7DB1',
          dark: '#456294',
          light: '#8FAAD4',
        },
        yotsuba: {
          DEFAULT: '#7EC850',
          dark: '#5FA635',
          light: '#A8E07D',
        },
        itsuki: {
          DEFAULT: '#E85A71',
          dark: '#C73D54',
          light: '#FF8A9D',
        },
        // UI colors
        panel: {
          DEFAULT: 'rgba(255, 255, 255, 0.85)',
          dark: 'rgba(30, 20, 25, 0.95)',
        },
      },
      fontFamily: {
        sans: ['var(--font-zen-kaku)', 'system-ui', 'sans-serif'],
        display: ['var(--font-zen-maru)', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'sakura-gradient': 'linear-gradient(135deg, #FFE5EC 0%, #FFF5F8 50%, #FFE8F0 100%)',
        'sakura-gradient-dark': 'linear-gradient(135deg, #2D1F26 0%, #1A1215 50%, #251A1F 100%)',
        'character-glow': 'radial-gradient(ellipse at center, var(--tw-gradient-from) 0%, transparent 70%)',
      },
      boxShadow: {
        'sakura': '0 4px 30px rgba(255, 107, 138, 0.15)',
        'sakura-lg': '0 8px 40px rgba(255, 107, 138, 0.25)',
        'character': '0 0 60px var(--character-color, rgba(255, 107, 138, 0.3))',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'sakura-fall': 'sakuraFall 10s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sakuraFall: {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
