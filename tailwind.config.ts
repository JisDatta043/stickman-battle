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
        background: "var(--background)",
        foreground: "var(--foreground)",
        game: {
          dark: "#0a0c14",
          card: "#121624",
          border: "#1e2640",
          accent: "#00f0ff",
          p1: "#3b82f6",
          p2: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "damage-shake": "damageShake 0.3s ease-in-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", filter: "drop-shadow(0 0 8px rgba(0,240,255,0.4))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 16px rgba(0,240,255,0.8))" },
        },
        damageShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
