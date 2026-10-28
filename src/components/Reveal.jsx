import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Wraps children and fades/slides them in the first time they scroll
 * into view. Animates once, then stays visible. Starts visible when the
 * user has asked for reduced motion, shows at once when keyboard focus
 * lands inside, and always shows when printed.
 *
 * With loadStagger, `delay` applies only to sections revealed right after
 * the page loads; a section reached later by scrolling appears without
 * waiting.
 */
export default function Reveal({ children, className = "", delay = 0, loadStagger = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion);
  const [late, setLate] = useState(false);

  useEffect(() => {
    if (visible) return;

    const node = ref.current;
    if (!node) return;

    const mountedAt = performance.now();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (loadStagger && performance.now() - mountedAt > 300) setLate(true);
          setVisible(true);
          observer.disconnect();
        }
      },
      // Any overlap counts, so a section taller than the screen still shows.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // Runs once: after the first reveal there is nothing left to watch.
  }, []);

  return (
    <div
      ref={ref}
      onFocus={() => {
        setLate(true);
        setVisible(true);
      }}
      className={`transition-all duration-700 ease-out print:translate-y-0 print:opacity-100 print:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${late ? 0 : delay}ms` }}
    >
      {children}
    </div>
  );
}
