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
        canvas: "#08090a",
        surface: {
          DEFAULT: "#0f1011",
          raised: "#191a1b",
          hover: "#1f2021",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          subtle: "rgba(255,255,255,0.05)",
          active: "rgba(255,255,255,0.14)",
        },
        txt: {
          primary: "#f7f8f8",
          secondary: "#d0d6e0",
          muted: "#8a8f98",
          ghost: "#62666d",
        },
        accent: {
          DEFAULT: "#5e6ad2",
          hover: "#828fff",
          glow: "rgba(94,106,210,0.15)",
        },
        success: "#27a644",
        warning: "#ffba00",
        danger: "#fb565b",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "8px",
        xl: "12px",
        pill: "9999px",
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
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
