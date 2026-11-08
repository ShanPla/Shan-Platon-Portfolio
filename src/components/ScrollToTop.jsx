import { useEffect, useLayoutEffect, useRef } from "react";
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

// The scroll position when the page was left, kept for a reload: the maps
// above don't survive one.
const RELOAD_KEY = "scroll-before-reload";

function saveForReload() {
  try {
    sessionStorage.setItem(RELOAD_KEY, JSON.stringify({ url: window.location.href, y: window.scrollY }));
  } catch {
    // Storage blocked (some private modes): a reload lands on the #section.
  }
}

function spotBeforeReload() {
  const [navigation] = performance.getEntriesByType("navigation");
  if (navigation?.type !== "reload") return undefined;
  try {
    const spot = JSON.parse(sessionStorage.getItem(RELOAD_KEY));
    return spot?.url === window.location.href ? { y: spot.y } : undefined;
  } catch {
    return undefined;
  }
}

// How far under the header a section's top can be and still count as the
// one being read. Enough that a section further down doesn't take over too
// early, and small enough that the short About section keeps its turn.
const READING_LINE = 100;

// The hash for the section being read: none for the first one (the hero),
// and the last one at the page's end, where it may never reach the line.
function hashInView() {
  const sections = [...document.querySelectorAll("section[id]")];
  if (sections.length === 0) return "";
  const line = (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) + READING_LINE;
  const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const current = atEnd
    ? sections[sections.length - 1]
    : sections.filter((section) => section.getBoundingClientRect().top <= line).pop();
  return !current || current === sections[0] ? "" : `#${current.id}`;
}

/**
 * Sets the scroll position when the page changes:
 * - browser Back/Forward restores the position you left,
 * - a link with state={{ restore: true }} returns to where you last left
 *   that page, or else behaves like any other link,
 * - a link with a hash (e.g. /#projects) lands on that section,
 * - a reload stays at the spot you reloaded from,
 * - any other page change starts at the top.
 * Jumps are instant; the smooth scrolling in index.css is for in-page links.
 *
 * On the home page it also keeps the address on the section being read, so
 * a reload or a copied link lands there. It replaces the current history
 * entry without telling the router, so scrolling adds nothing to browser
 * Back and doesn't move the page again.
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

  useEffect(() => {
    window.addEventListener("pagehide", saveForReload);
    return () => window.removeEventListener("pagehide", saveForReload);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      // A link just changed the address, and the new page has not rendered
      // yet. Writing here would put the old page back in the address.
      if (window.location.pathname !== pathname) return;
      const next = hashInView();
      if (next === window.location.hash) return;
      const { search } = window.location;
      window.history.replaceState(window.history.state, "", `${pathname}${search}${next}`);
      // An entry without a router key is known by its address, which just
      // changed; Back has to find its saved position under the new one.
      if (!window.history.state?.key) lastEntry.current = pathname + next;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

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
      lastPath.current === null
        ? spotBeforeReload()
        : navType === "POP"
          ? positions.get(entry)
          : state?.restore
            ? lastVisits.get(pathname)
            : undefined;
    const target = findTarget(hash);

    if (saved) {
      window.scrollTo({ top: saved.y, behavior: "instant" });

      // After a reload the web fonts can arrive after this, and the reflow
      // moves the page a little; go back to the spot once they are in,
      // unless the visitor has scrolled further than a reflow would.
      if (lastPath.current === null) {
        document.fonts?.ready?.then(() => {
          if (Math.abs(window.scrollY - saved.y) < 100) {
            window.scrollTo({ top: saved.y, behavior: "instant" });
          }
        });
      }
    } else if (target) {
      target.scrollIntoView({ block: "start", behavior: "instant" });

      // On a first visit the web fonts arrive after this, and the reflow
      // moves the section; jump again once they are in, unless the visitor
      // has scrolled since. The browser's scroll anchoring can change
      // scrollY in that reflow too, keeping the section where it was on
      // screen, so either one unchanged means the visitor hasn't scrolled.
      const y = window.scrollY;
      const top = target.getBoundingClientRect().top;
      document.fonts?.ready?.then(() => {
        const stayed = Math.abs(target.getBoundingClientRect().top - top) < 1;
        if (window.scrollY === y || stayed) {
          target.scrollIntoView({ block: "start", behavior: "instant" });
        }
      });
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
