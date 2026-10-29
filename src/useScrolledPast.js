import { useEffect, useState } from "react";

/**
 * True once the page has scrolled further than `distance` pixels. The
 * headers use it to show their bottom rule once the page moves.
 *
 * `distance` can also be a function, read again on every scroll and
 * resize, for a distance that follows the window or the page's length
 * (BackToTop.jsx). Define it outside the component, so it stays the same
 * between renders.
 */
export default function useScrolledPast(distance) {
  const [past, setPast] = useState(false);

  useEffect(() => {
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

  return past;
}
