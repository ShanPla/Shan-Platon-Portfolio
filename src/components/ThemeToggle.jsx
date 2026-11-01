import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons.jsx";

// The visitor's own pick, saved on this browser. Until there is one, the
// theme follows the system setting. The script in index.html reads the
// same key before the first paint, so a page never opens in the other
// theme.
const KEY = "theme";
const SYSTEM_DARK = "(prefers-color-scheme: dark)";

function savedTheme() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    // Storage blocked (some private modes): follow the system.
    return null;
  }
}

// Switches the class with transitions off until the next frame, and gives
// the phone's browser bar the page's own background.
function applyTheme(dark) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.classList.toggle("dark", dark);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", getComputedStyle(document.body).backgroundColor);
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
}

// Day/night switch in the header: the sun on the left, the moon on the
// right, and a knob that slides over the one in use. Screen readers hear
// Dark mode, on or off. The ::after layer makes the tap area 44px tall
// while the switch stays 28px, the height of the header's logo line.
export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // On first show, gives the browser bar the colour of the theme the
  // script in index.html picked.
  // Only on mount; later changes call applyTheme themselves.
  useEffect(() => {
    applyTheme(document.documentElement.classList.contains("dark"));
  }, []);

  // Follows a change to the system setting while there is no saved pick.
  useEffect(() => {
    const media = window.matchMedia(SYSTEM_DARK);
    const follow = (e) => {
      if (savedTheme()) return;
      applyTheme(e.matches);
      setDark(e.matches);
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  function toggle() {
    const next = !dark;
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      // Not saved; the switch still holds until the page reloads.
    }

    applyTheme(next);
    setDark(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
      className="lift relative flex h-7 w-12 shrink-0 items-center justify-between rounded-full bg-surface px-[5px] text-inkmuted after:absolute after:-inset-2"
    >
      <SunIcon className="h-3 w-3" />
      <MoonIcon className="h-3 w-3" />

      {/* data-theme-knob keeps its slide while .theme-switching stops
          every other transition. */}
      <span
        data-theme-knob
        aria-hidden="true"
        className={`absolute left-[3px] top-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          dark ? "translate-x-5" : ""
        }`}
      >
        {dark ? <MoonIcon className="h-3 w-3" /> : <SunIcon className="h-3 w-3" />}
      </span>
    </button>
  );
}
