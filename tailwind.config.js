/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#000000",
          elevated: "rgba(255, 255, 255, 0.02)",
          surface: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(255, 255, 255, 0.06)",
        },
        bg: {
          primary: "#000000",
          secondary: "rgba(255, 255, 255, 0.04)",
          card: "rgba(255, 255, 255, 0.04)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.05)",
          ghost: "rgba(255, 255, 255, 0.12)",
        },
        txt: {
          primary: "#f0f0fa",
          secondary: "rgba(240, 240, 250, 0.65)",
          muted: "rgba(240, 240, 250, 0.40)",
          ghost: "rgba(240, 240, 250, 0.25)",
        },
        accent: {
          DEFAULT: "#f0f0fa",
          hover: "rgba(240, 240, 250, 0.85)",
          glow: "rgba(240, 240, 250, 0.15)",
        },
        status: {
          green: "#4ade80",
          yellow: "#fbbf24",
          red: "#f87171",
          blue: "#60a5fa",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        widest: "0.12em",
        wider: "0.08em",
        wide: "0.04em",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 2s infinite",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
