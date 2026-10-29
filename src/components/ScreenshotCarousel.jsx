import { useEffect, useRef, useState } from "react";
import { srcSet } from "../imageCopies.js";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons.jsx";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Shows one screenshot at a time, with its caption and arrow controls.
 * Arrow keys work while focus is inside it and swipes work on touch
 * screens. Clicking a slide calls onOpen with that slide's index.
 * `size` ({ width, height }) reserves each slide's space before it loads.
 */
export default function ScreenshotCarousel({ shots, label, size, onOpen, className = "" }) {
  const [index, setIndex] = useState(0);
  // Neighbouring slides are clipped out of view, so lazy loading would wait
  // until they slide in. Once the first slide has loaded, fetch them early.
  const [warm, setWarm] = useState(false);
  const swipeStart = useRef(null);
  const lastSwipe = useRef(0);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const prevIndex = useRef(index);

  const count = shots.length;
  const step = (by) => setIndex((current) => (current + by + count) % count);

  // Wrapping from the last slide to the first (or back) jumps straight
  // there instead of sliding past every screenshot in between.
  const wrapped = Math.abs(index - prevIndex.current) > 1;

  useEffect(() => {
    prevIndex.current = index;

    // Arrow keys change the slide while a slide has focus: move focus along,
    // so it never stays on a hidden slide.
    if (trackRef.current?.contains(document.activeElement)) {
      slideRefs.current[index]?.focus({ preventScroll: true });
    }
  }, [index]);

  const isNear = (i) => {
    const distance = (i - index + count) % count;
    return distance <= 1 || distance === count - 1;
  };

  function onPointerUp(e) {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;

    if (Math.abs(dx) > 50) {
      lastSwipe.current = Date.now();
      step(dx < 0 ? 1 : -1);
    }
  }

  function onKeyDown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  }

  const arrowClass =
    "relative rounded-full border border-line p-1.5 text-inkmuted transition-colors after:absolute after:-inset-2 hover:border-signal/50 hover:text-signaldeep";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={className}
    >
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div
          ref={trackRef}
          onPointerDown={(e) => (swipeStart.current = e.clientX)}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
          className={`flex select-none touch-pan-y touch-pinch-zoom ${
            wrapped ? "" : "transition-transform duration-500 ease-out"
          }`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {shots.map((shot, i) => {
            const active = i === index;

            return (
              <div
                key={shot.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!active}
                className="w-full shrink-0"
              >
                <button
                  ref={(el) => (slideRefs.current[i] = el)}
                  type="button"
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    if (Date.now() - lastSwipe.current > 300) onOpen(i);
                  }}
                  className="group block w-full cursor-zoom-in overflow-hidden focus-visible:outline-offset-[-4px]"
                >
                  <img
                    src={shot.src}
                    srcSet={srcSet(shot.src, size)}
                    // A slide spans the column, inside the 1px border.
                    sizes="(min-width: 1024px) 974px, calc(100vw - 50px)"
                    alt={shot.alt}
                    width={size?.width}
                    height={size?.height}
                    loading={warm && isNear(i) ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    onLoad={active ? () => setWarm(true) : undefined}
                    className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  <span className="sr-only">Open larger view</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        {/* Every caption is laid out in the same cell, invisibly, so the row
            keeps the height of the longest one and nothing below jumps. */}
        <div className="grid min-w-0 flex-1 pt-[5px] text-xs leading-5 text-inkmuted">
          {shots.map((shot) => (
            <p key={shot.src} aria-hidden="true" className="invisible [grid-area:1/1]">
              {shot.caption}
            </p>
          ))}

          <p aria-live="polite" aria-atomic="true" className="[grid-area:1/1]">
            <span className="sr-only">
              Screenshot {index + 1} of {count}:{" "}
            </span>
            {shots[index].caption}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous screenshot"
            className={arrowClass}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <span
            aria-hidden="true"
            className="min-w-[3.5rem] text-center font-mono text-[10px] uppercase tracking-widest text-inkmuted"
          >
            {pad(index + 1)} / {pad(count)}
          </span>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next screenshot"
            className={arrowClass}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
