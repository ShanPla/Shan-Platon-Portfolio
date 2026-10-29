import useScrolledPast from "../useScrolledPast.js";
import { ArrowUpIcon } from "./icons.jsx";

// Halfway down the page, but at least one screen and at most two. Most
// pages here scroll only two or three screens, where a flat two screens
// would show the button for the last few pixels, if at all. Measured
// again on every scroll and resize, so a phone's address bar showing or
// hiding is followed.
const showAfter = () => {
  const screen = window.innerHeight;
  const half = (document.documentElement.scrollHeight - screen) / 2;
  return Math.min(Math.max(half, screen), screen * 2);
};

/**
 * Round button at the window's bottom right, shown once the page has
 * scrolled far enough (showAfter). It goes back to the top (smoothly, or
 * at once under reduced motion: the scroll-behavior in index.css) and
 * moves focus to the page's <main id="main">, so the next Tab starts from
 * the top as well.
 *
 * Render it outside <main>, so it stays out of ScrollToTop's list of the
 * page's controls. The screenshot viewer is rendered after #root, so it
 * covers this button.
 */
export default function BackToTop() {
  const [shown] = useScrolledPast(showAfter);

  function backToTop() {
    window.scrollTo({ top: 0 });
    document.getElementById("main")?.focus({ preventScroll: true });
  }

  // The outer strip stays in the page: 48px at the very end, so scrolled to
  // the bottom, the last line (the footer, or the next-project link) sits
  // above the button rather than under it. The inner wrapper fades and
  // rises in, leaving the button's own transform free for the lift on
  // hover; while hidden, the button can't be tabbed to.
  return (
    <div className="h-12 print:hidden">
      <div
        className={`fixed bottom-4 right-4 z-40 transition-[opacity,transform,visibility] duration-[260ms] ease-out sm:bottom-6 sm:right-6 ${
          shown ? "visible translate-y-0 opacity-100" : "invisible translate-y-2.5 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={backToTop}
          aria-label="Back to top"
          className="lift flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink"
        >
          <ArrowUpIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
