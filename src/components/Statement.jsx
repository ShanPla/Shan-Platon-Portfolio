import { Fragment, useEffect, useRef, useState } from "react";
import { statement } from "../data/content.js";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Where the middle of the sentence is, as a share of the window height,
// when the first word lights (START) and when the last one does (END).
const START = 0.85;
const END = 0.35;

// The sentence as words, each cut into pieces where the highlight starts
// or ends, so in "rely on." only "on" turns blue, not the period.
function toWords({ text, highlight = "" }) {
  const from = highlight ? text.indexOf(highlight) : -1;
  const isKey = (i) => from >= 0 && i >= from && i < from + highlight.length;

  return [...text.matchAll(/[^ ]+/g)].map((match) => {
    const pieces = [];
    for (let i = match.index; i < match.index + match[0].length; i++) {
      const last = pieces[pieces.length - 1];
      if (last && last.key === isKey(i)) last.text += text[i];
      else pieces.push({ text: text[i], key: isKey(i) });
    }
    return pieces;
  });
}

const WORDS = toWords(statement);

/**
 * A dark band with one large sentence whose words light up in order as it
 * rises through the window, and dim again when scrolled back. With reduced
 * motion every word is lit from the start and nothing listens to scroll.
 */
export default function Statement() {
  const bandRef = useRef(null);
  const sentenceRef = useRef(null);
  const [lit, setLit] = useState(() => (prefersReducedMotion() ? WORDS.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let frame = 0;

    function update() {
      frame = 0;
      const { top, height } = sentenceRef.current.getBoundingClientRect();
      const middle = (top + height / 2) / window.innerHeight;
      const progress = Math.min(1, Math.max(0, (START - middle) / (START - END)));
      setLit(Math.round(progress * WORDS.length));
    }

    // At most one update per frame, however often scroll fires.
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function listen(on) {
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", onScroll, { passive: true });
      window[method]("resize", onScroll);
    }

    // Listens only while the band is within half a window of the screen,
    // and updates as it comes near and as it goes, so its words are right
    // before it shows, even after a jump straight past it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        listen(entry.isIntersecting);
        update();
      },
      { rootMargin: "50% 0px" }
    );
    observer.observe(bandRef.current);

    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="p-[clamp(8px,1.5vw,20px)]">
      <div
        ref={bandRef}
        className="relative overflow-hidden rounded-[clamp(14px,2vw,24px)] bg-ink print:bg-transparent"
      >
        {/* Faint grid, as behind the hero */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
          {statement.label && (
            <p className="font-mono text-xs uppercase tracking-widest text-paper/60 print:text-inkmuted">
              {statement.label}
            </p>
          )}

          <p
            ref={sentenceRef}
            className="mt-5 max-w-4xl text-balance font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
          >
            {WORDS.map((pieces, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span
                  className={`transition-colors duration-300 print:text-ink ${
                    i < lit ? "text-paper" : "text-paper/40"
                  }`}
                >
                  {pieces.map((piece, j) =>
                    piece.key ? (
                      <span
                        key={j}
                        className={`transition-colors duration-300 ${i < lit ? "text-signal" : ""}`}
                      >
                        {piece.text}
                      </span>
                    ) : (
                      <Fragment key={j}>{piece.text}</Fragment>
                    )
                  )}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
