/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Hover styles only on devices with a real pointer, so a tapped button
  // doesn't stay highlighted on phones.
  future: {
    hoverOnlyWhenSupported: true,
  },
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
        // Darker accents for small text: about 5:1 on paper and white,
        // where the base accents fail the 4.5:1 contrast minimum.
        amberdeep: "#A85400",
        okdeep: "#18794E",
        // Near-black backdrop for the screenshot viewer.
        scrim: "#0E0F12",
      },
      // Small mono labels and buttons, in rem so they follow the reader's
      // browser font size.
      fontSize: {
        "3xs": "0.625rem", // 10px
        "2xs": "0.6875rem", // 11px
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