import { useEffect, useState } from "react";

/**
 * True once the page has scrolled further than `distance` pixels. The
 * headers use it to show their bottom rule once the page moves.
 */
export default function useScrolledPast(distance) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const update = () => setPast(window.scrollY > distance);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [distance]);

  return past;
}
