import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons.jsx";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Full-screen viewer for project screenshots. The arrow keys, the arrow
 * buttons, or a swipe move between shots; Escape, the close button, or a
 * click on the dark area closes it. Focus stays inside while it is open and
 * goes back to whatever opened it.
 *
 * Rendered into document.body: Reveal's transform on the page sections
 * would otherwise pin a fixed overlay to the section instead of the window.
 */
export default function Lightbox({ shots, index, onIndexChange, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const swipeStart = useRef(null);
  const lastSwipe = useRef(0);

  const count = shots.length;
  const shot = shots[index];
  const step = (by) => onIndexChange((index + by + count) % count);

  // Lock page scroll and move focus in; undo both on close.
  useEffect(() => {
    const opener = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && count > 1) {
        e.preventDefault();
        onIndexChange((index + 1) % count);
      } else if (e.key === "ArrowLeft" && count > 1) {
        e.preventDefault();
        onIndexChange((index - 1 + count) % count);
      } else if (e.key === "Tab") {
        // Keep Tab cycling through the viewer's own buttons.
        const buttons = [...dialogRef.current.querySelectorAll("button")];
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const active = document.activeElement;
        const inside = dialogRef.current.contains(active) && active !== dialogRef.current;

        if (e.shiftKey && (!inside || active === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || active === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, count, onClose, onIndexChange]);

  function onPointerUp(e) {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;

    if (count > 1 && Math.abs(dx) > 50) {
      lastSwipe.current = Date.now();
      step(dx < 0 ? 1 : -1);
    }
  }

  // Clicks on the dark area close the viewer, except the click a swipe ends with.
  function onClick(e) {
    if (Date.now() - lastSwipe.current < 300) return;
    if (e.target.dataset.backdrop !== undefined) onClose();
  }

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2.5 text-paper/80 transition-colors hover:bg-paper/15 hover:text-paper";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
      tabIndex={-1}
      data-backdrop
      onClick={onClick}
      onPointerDown={(e) => (swipeStart.current = e.clientX)}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipeStart.current = null)}
      className="fixed inset-0 z-50 flex select-none touch-pan-y touch-pinch-zoom flex-col bg-ink text-paper focus:outline-none"
    >
      <div
        data-backdrop
        className="flex items-center justify-between px-4 py-3 sm:px-6"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper/70">
          {pad(index + 1)} / {pad(count)}
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          title="Close (Esc)"
          className="rounded-full p-2.5 text-paper/80 transition-colors hover:bg-paper/15 hover:text-paper"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        data-backdrop
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
      >
        <img
          src={shot.src}
          alt={shot.alt}
          draggable={false}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous screenshot"
              title="Previous (←)"
              className={`${arrowClass} left-2 sm:left-5`}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next screenshot"
              title="Next (→)"
              className={`${arrowClass} right-2 sm:right-5`}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <p
        data-backdrop
        aria-live="polite"
        className="mx-auto w-full max-w-3xl px-6 pb-6 pt-4 text-center text-sm leading-6 text-paper/80"
      >
        {shot.caption}
      </p>
    </div>,
    document.body
  );
}
