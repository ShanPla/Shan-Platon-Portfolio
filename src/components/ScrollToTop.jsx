import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll position and focused control per history entry, so browser Back
// returns to where you were.
const positions = new Map();

// The same, for the last visit to each page, so a link with
// state={{ restore: true }} (Back to Projects) returns there too.
const lastVisits = new Map();

// The page's links and buttons in order; the focused one's place in this
// list is saved with the scroll position. Hidden carousel slides
// (tabindex -1) are left out, so the list doesn't change with the slide.
const FOCUSABLE = "main a[href], main button:not([tabindex='-1'])";

// The element a #hash points to. A malformed %-escape (e.g. #50%off) is
// looked up as written instead of crashing the page.
function findTarget(hash) {
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Keep the id as written.
  }
  return id ? document.getElementById(id) : null;
}

/**
 * Sets the scroll position when the page changes:
 * - browser Back/Forward restores the position you left,
 * - a link with state={{ restore: true }} returns to where you last left
 *   that page, or else behaves like any other link,
 * - a link with a hash (e.g. /#projects) lands on that section,
 * - any other page change starts at the top.
 * Jumps are instant; the smooth scrolling in index.css is for in-page links.
 *
 * After an in-app page change it also moves focus: when returning, to the
 * link or button you left from, otherwise to the heading of the new page
 * (or of the linked section), so screen readers hear the change.
 */
export default function ScrollToTop() {
  const { pathname, hash, key, state } = useLocation();
  const navType = useNavigationType();
  // The home page's plain #links make history entries without a router key,
  // as does the first page loaded; tell those apart by their address.
  const entry = key === "default" ? pathname + hash : key;
  const lastEntry = useRef(entry);
  const lastPath = useRef(null);

  // Updated after every render; the cleanup below still sees the entry
  // being left.
  useLayoutEffect(() => {
    lastEntry.current = entry;
  });

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Back/Forward between the home page's #links: go to that section, or to
  // the top. A clicked #link arrives here too, so no behavior is given and
  // it keeps its smooth scroll. Declared before the effect below, so
  // lastPath still holds the previous page and page changes are left to it.
  useLayoutEffect(() => {
    if (lastPath.current !== pathname) return;
    const target = findTarget(hash);
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo({ top: 0 });
  }, [hash]);

  useLayoutEffect(() => {
    const saved =
      navType === "POP"
        ? positions.get(entry)
        : state?.restore
          ? lastVisits.get(pathname)
          : undefined;
    const target = findTarget(hash);

    if (saved) {
      window.scrollTo({ top: saved.y, behavior: "instant" });
    } else if (target) {
      target.scrollIntoView({ block: "start", behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Skip the first load (and React's development re-run of this effect).
    // Coming back with nothing to refocus, focus stays put: an off-screen
    // heading would make the next Tab jump away from the restored spot.
    if (lastPath.current !== null && lastPath.current !== pathname) {
      const next = saved
        ? document.querySelectorAll(FOCUSABLE)[saved.focus]
        : (target ?? document.querySelector("main"))?.querySelector("h1, h2");
      next?.focus({ preventScroll: true });
    }
    lastPath.current = pathname;

    return () => {
      const focus = [...document.querySelectorAll(FOCUSABLE)].indexOf(document.activeElement);
      const position = { y: window.scrollY, focus };
      positions.set(lastEntry.current, position);
      lastVisits.set(pathname, position);
    };
  }, [pathname]);

  return null;
}
