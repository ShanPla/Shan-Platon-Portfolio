/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F7FA",
        surface: "#FFFFFF",
        ink: "#16213E",
        inkmuted: "#5B6478",
        line: "#DFE3EA",
        signal: "#2F6FED",
        signaldeep: "#1E4FC0",
        amber: "#F2994A",
        ok: "#2FA870",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(#DFE3EA 1px, transparent 1px), linear-gradient(90deg, #DFE3EA 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
