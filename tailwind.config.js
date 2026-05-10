/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem"
      },
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        background: "#F8F9FA",
        foreground: "#1A2D4B",
        navy: {
          DEFAULT: "#1A2D4B", // Midnight Navy Blue
          soft: "#2A4065",
          foreground: "#ffffff"
        },
        red: { // Mapping 'red' classes to the Dusty Rose color so we don't have to rewrite the whole UI
          DEFAULT: "#D98A81", // Dusty Rose / Salmon Pink
          soft: "#F5DCD9",
          deep: "#C27067",
          foreground: "#ffffff"
        },
        primary: {
          DEFAULT: "#1A2D4B",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#D98A81",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#64748b"
        },
        accent: {
          DEFAULT: "#D98A81",
          foreground: "#ffffff"
        },
        border: "#E2E8F0",
        card: "#ffffff"
      },
      fontFamily: {
        serif: ['var(--font-sans)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        lg: "1.25rem",
        md: "0.85rem",
        sm: "0.5rem"
      },
      boxShadow: {
        soft: "0 4px 20px rgba(26, 45, 75, 0.05)",
        float: "0 10px 40px rgba(26, 45, 75, 0.08)",
        card: "0 2px 12px rgba(0,0,0,0.06)",
        premium: "0 20px 50px rgba(26, 45, 75, 0.12)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

