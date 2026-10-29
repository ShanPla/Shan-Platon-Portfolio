import { useEffect, useLayoutEffect, useState } from "react";

/**
 * [past, settled]. past is true once the page has scrolled further than
 * `distance` pixels; the headers use it to show their bottom rule once the
 * page moves. settled turns true a frame after the first measurement, so a
 * caller can hold back its transition until then: a page that opens
 * already scrolled (a restored position or a #section link) then shows
 * the right state at once instead of fading into it.
 *
 * `distance` can also be a function, read again on every scroll and
 * resize, for a distance that follows the window or the page's length
 * (BackToTop.jsx). Define it outside the component, so it stays the same
 * between renders.
 */
export default function useScrolledPast(distance) {
  const [past, setPast] = useState(false);
  const [settled, setSettled] = useState(false);

  // A layout effect, so the first measurement is in before the first
  // paint. ScrollToTop sits earlier in the tree, so the scroll position
  // is already set by then.
  useLayoutEffect(() => {
    const limit = typeof distance === "function" ? distance : () => distance;
    const update = () => setPast(window.scrollY > limit());

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [distance]);

  // State set in an animation frame renders after that frame is drawn.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return [past, settled];
}
