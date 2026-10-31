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

// Round button in the header. It shows the moon in light mode and the sun
// in dark mode; screen readers hear Dark mode, pressed or not. The ::after
// layer makes the tap area 44px while the button stays 28px, the height of
// the header's logo line.
export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    applyTheme(dark);
  }, [dark]);

  // Follows a change to the system setting while there is no saved pick.
  useEffect(() => {
    const media = window.matchMedia(SYSTEM_DARK);
    const follow = (e) => {
      if (!savedTheme()) setDark(e.matches);
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  function toggle() {
    try {
      localStorage.setItem(KEY, dark ? "light" : "dark");
    } catch {
      // Not saved; the switch still holds until the page reloads.
    }
    setDark(!dark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark mode"
      className="lift relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-ink after:absolute after:-inset-2"
    >
      {dark ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
    </button>
  );
}
