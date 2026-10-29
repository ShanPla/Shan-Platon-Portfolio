import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A section's numbered label (01 — About), followed on the same line by a
 * rule that fills the rest of the width. The rule draws itself from the
 * left the first time the label scrolls into view. It is drawn from the
 * start under reduced motion, and always drawn when printed.
 *
 * `as` sets the element (a <p> by default); other props, such as
 * aria-label, go on that element.
 */
export default function SectionLabel({ as: Tag = "p", className = "", children, ...props }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(prefersReducedMotion);

  useEffect(() => {
    if (drawn) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      // The same margin as Reveal, so it fires as its section starts to show.
      { rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // Runs once: after the first draw there is nothing left to watch.
  }, []);

  return (
    <Tag
      ref={ref}
      {...props}
      className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-signaldeep ${className}`}
    >
      {children}
      {/* Starts 200ms in: the label fades in with its section (Reveal), and
          the rule's quick start would otherwise pass while it is faint. A
          border rather than a background, since browsers print borders
          but leave out backgrounds by default. */}
      <span
        aria-hidden="true"
        className={`h-0 flex-1 origin-left border-t border-line transition-transform delay-200 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] print:scale-x-100 print:transition-none ${
          drawn ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Tag>
  );
}
