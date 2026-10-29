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
  // How far a swipe has moved the track, in px; null when not swiping.
  const [dragX, setDragX] = useState(null);
  const swipe = useRef(null);
  const lastSwipe = useRef(0);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const prevIndex = useRef(index);

  const count = shots.length;
  const step = (by) => setIndex((current) => (current + by + count) % count);
  const dragging = dragX !== null;

  // Wrapping from the last slide to the first (or back) jumps straight
  // there instead of sliding past every screenshot in between.
  const wrapped = Math.abs(index - prevIndex.current) > 1;

  // Past either end there is no slide to show, so the track follows the
  // finger only a third as far there.
  const pastEnd = (index === 0 && dragX > 0) || (index === count - 1 && dragX < 0);
  const offset = pastEnd ? dragX / 3 : dragX;

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

  // A press turns into a swipe once it moves 8px sideways (more than up or
  // down). Only then is the pointer captured, so a tap still opens the
  // slide and a vertical swipe still scrolls the page.
  function onPointerDown(e) {
    if (!e.isPrimary || e.button !== 0) return;
    swipe.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      active: false,
      moves: [{ x: e.clientX, t: e.timeStamp }],
    };
  }

  function onPointerMove(e) {
    const s = swipe.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;

    if (!s.active) {
      // A mouse let go outside the carousel before it became a swipe.
      if (e.buttons === 0) {
        swipe.current = null;
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return;
      s.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    // The last 100ms of moves give the speed on release.
    s.moves = s.moves.filter((m) => e.timeStamp - m.t < 100);
    s.moves.push({ x: e.clientX, t: e.timeStamp });
    setDragX(dx);
  }

  function onPointerUp(e) {
    const s = swipe.current;
    if (!s || s.id !== e.pointerId) return;
    swipe.current = null;
    if (!s.active) return;

    const dx = e.clientX - s.x;
    const from = s.moves.find((m) => e.timeStamp - m.t < 100);
    const speed = from ? (e.clientX - from.x) / Math.max(e.timeStamp - from.t, 1) : 0;
    // A quick flick changes slide however short it was, unless it flicks
    // back; a slower swipe needs 50px. Otherwise the track slides back.
    const flick = Math.abs(speed) > 0.3 ? Math.sign(speed) : 0;
    const direction = flick || (Math.abs(dx) > 50 ? Math.sign(dx) : 0);

    lastSwipe.current = Date.now();
    setDragX(null);
    if (direction !== 0 && direction === Math.sign(dx)) step(-direction);
  }

  function onPointerCancel(e) {
    if (swipe.current?.id !== e.pointerId) return;
    swipe.current = null;
    setDragX(null);
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
        {/* During a swipe the track follows the finger, with no easing. */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className={`flex select-none touch-pan-y touch-pinch-zoom ${
            wrapped || dragging ? "" : "transition-transform duration-500 ease-out"
          }`}
          style={{
            transform: dragging
              ? `translateX(calc(-${index * 100}% + ${offset}px))`
              : `translateX(-${index * 100}%)`,
          }}
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
            className="min-w-[3.5rem] text-center font-mono text-3xs uppercase tracking-widest text-inkmuted"
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
