// A colour from index.css, kept as RGB channels so opacity classes such
// as bg-paper/95 still work.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Dark mode follows the .dark class on <html>, which the script in
  // index.html sets before the first paint and ThemeToggle.jsx changes.
  darkMode: "class",
  // Hover styles only on devices with a real pointer, so a tapped button
  // doesn't stay highlighted on phones.
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      // The values live in index.css as CSS variables, one set for light
      // and one for dark, so every class here switches with the theme.
      colors: {
        paper: token("paper"),
        surface: token("surface"),
        ink: token("ink"),
        inkmuted: token("inkmuted"),
        line: token("line"),
        signal: token("signal"),
        signaldeep: token("signaldeep"),
        amber: token("amber"),
        ok: token("ok"),
        // Accents for small text, about 5:1 on the page and cards: darker
        // in light mode, lighter in dark mode.
        amberdeep: token("amberdeep"),
        okdeep: token("okdeep"),
        // The dark blocks (the statement band, the GitHub tile, the next
        // project band, the primary button) and the light text on them:
        // ink and paper in light mode, a raised navy in dark mode.
        block: token("block"),
        onblock: token("onblock"),
        // Blue under light text in both modes: the next project band on hover.
        signalfill: token("signalfill"),
        // The frames and hard shadows of cards and buttons: ink in light
        // mode, a muted blue-grey in dark mode.
        edge: token("edge"),
        // Near-black backdrop for the screenshot viewer, in both modes.
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
        grid: "linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};