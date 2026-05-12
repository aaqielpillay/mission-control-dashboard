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
          DEFAULT: "#050507",
          surface: "#101010",
          raised: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(0, 0, 0, 0.35)",
        },
        bg: {
          primary: "#050507",
          secondary: "#101010",
          card: "#101010",
        },
        border: {
          DEFAULT: "#3d3a39",
          subtle: "rgba(61, 58, 57, 0.65)",
          ghost: "rgba(0, 217, 146, 0.45)",
        },
        txt: {
          primary: "#f2f2f2",
          secondary: "#b8b3b0",
          muted: "#8b949e",
          ghost: "#5f6368",
        },
        accent: {
          DEFAULT: "#00d992",
          alt: "#2fd6a1",
          hover: "#22e2a3",
          glow: "rgba(0, 217, 146, 0.25)",
        },
        status: {
          green: "#10b981",
          yellow: "#ffba00",
          red: "#fb565b",
          blue: "#3b82f6",
        },
        warn: {
          amber: "#ffba00",
          coral: "#fb565b",
          teal: "#4cb3d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.09em",
        tighter: "-0.06em",
        widest: "0.16em",
        wider: "0.12em",
        wide: "0.08em",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        pill: "9999px",
      },
      boxShadow: {
        ambient: "0 0 15px rgba(92, 88, 85, 0.2)",
        dramatic: "0 20px 60px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 3s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 4px rgba(0, 217, 146, 0.35)" },
          "50%": { boxShadow: "0 0 14px rgba(0, 217, 146, 0.65)" },
        },
      },
    },
  },
  plugins: [],
};
