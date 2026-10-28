import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons.jsx";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Shows one screenshot at a time, with its caption and arrow controls.
 * Arrow keys work while focus is inside it and swipes work on touch
 * screens. Clicking a slide calls onOpen with that slide's index.
 */
export default function ScreenshotCarousel({ shots, label, onOpen, className = "" }) {
  const [index, setIndex] = useState(0);
  // Neighbouring slides are clipped out of view, so lazy loading would wait
  // until they slide in. Once the first slide has loaded, fetch them early.
  const [warm, setWarm] = useState(false);
  const swipeStart = useRef(null);
  const lastSwipe = useRef(0);

  const count = shots.length;
  const step = (by) => setIndex((current) => (current + by + count) % count);

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
    "rounded-full border border-line p-1.5 text-inkmuted transition-colors hover:border-signal/50 hover:text-signal";

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
          onPointerDown={(e) => (swipeStart.current = e.clientX)}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
          className="flex select-none touch-pan-y touch-pinch-zoom transition-transform duration-500 ease-out"
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
                  type="button"
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    if (Date.now() - lastSwipe.current > 300) onOpen(i);
                  }}
                  className="block w-full cursor-zoom-in focus-visible:outline-offset-[-4px]"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading={warm && isNear(i) ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    onLoad={active ? () => setWarm(true) : undefined}
                    className="block h-auto w-full"
                  />
                  <span className="sr-only">Open larger view</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <p
          aria-live="polite"
          className="min-h-[2.5rem] text-xs leading-5 text-inkmuted"
        >
          {shots[index].caption}
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous screenshot"
            className={arrowClass}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <span className="min-w-[4.5rem] text-center font-mono text-[10px] uppercase tracking-widest text-inkmuted">
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
