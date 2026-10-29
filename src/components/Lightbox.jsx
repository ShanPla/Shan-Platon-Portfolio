import { useEffect, useLayoutEffect, useRef } from "react";
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
export default function Lightbox({ shots, index, label, onIndexChange, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const swipeStart = useRef(null);
  const lastSwipe = useRef(0);
  const closing = useRef(false);

  const count = shots.length;
  const shot = shots[index];

  // The shot last asked for. A new shot reaches the address at once but
  // renders a moment later, so quick presses count on from it rather than
  // from the shot still on screen.
  const wanted = useRef(index);
  useLayoutEffect(() => {
    wanted.current = index;
  }, [index]);

  const step = (by) => {
    wanted.current = (wanted.current + by + count) % count;
    onIndexChange(wanted.current);
  };

  // Closing can wait for browser Back to land; a second Escape or click in
  // that moment would go Back again, off the page.
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    onClose();
  };

  // Lock page scroll, hide the page from screen readers, and move focus in;
  // undo all three on close. A layout effect, so a page change while open
  // (browser Back) undoes them before the new page moves focus.
  useLayoutEffect(() => {
    const opener = document.activeElement;
    const root = document.getElementById("root");
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    // React 18 has no inert prop, so set the attribute directly.
    root?.setAttribute("inert", "");
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      // Before restoring focus: an inert element can't take focus.
      root?.removeAttribute("inert");
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // Fetch the neighbouring shots so the next picture is ready.
  useEffect(() => {
    if (count < 2) return;
    for (const by of [1, -1]) {
      new Image().src = shots[(index + by + count) % count].src;
    }
  }, [index, count, shots]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight" && count > 1) {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft" && count > 1) {
        e.preventDefault();
        step(-1);
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
    if (e.target.dataset.backdrop !== undefined) close();
  }

  // Ringed so the round buttons show on the dark backdrop and over light
  // screenshots on phones, where they overlap the picture.
  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-scrim/70 p-2.5 text-paper/80 ring-1 ring-inset ring-paper/15 transition-colors hover:bg-paper/15 hover:text-paper focus-visible:outline-paper";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-describedby="lightbox-caption"
      tabIndex={-1}
      data-backdrop
      onClick={onClick}
      onPointerDown={(e) => (swipeStart.current = e.clientX)}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipeStart.current = null)}
      className="fixed inset-0 z-50 flex select-none touch-pan-y touch-pinch-zoom flex-col bg-scrim text-paper focus:outline-none"
    >
      <div
        data-backdrop
        className="flex items-center justify-between px-4 py-3 sm:px-6"
      >
        <p
          aria-hidden="true"
          className="font-mono text-[11px] uppercase tracking-widest text-paper/70"
        >
          {pad(index + 1)} / {pad(count)}
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close viewer"
          title="Close (Esc)"
          className="relative rounded-full p-2.5 text-paper/80 transition-colors after:absolute after:-inset-1 hover:bg-paper/15 hover:text-paper focus-visible:outline-paper"
        >
          <CloseIcon />
        </button>
      </div>

      {/* The caption sits right under the picture, not at the window's foot. */}
      <div
        data-backdrop
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-6 sm:px-20"
      >
        {/* The picture's row spans the full width, so the arrows sit at the
            window's sides, centred on the picture. It shrinks to leave room
            for the caption, and the picture fits inside it. */}
        <div
          data-backdrop
          className="relative -mx-4 flex min-h-0 items-center justify-center self-stretch px-4 sm:-mx-20 sm:px-20"
        >
          <img
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            draggable={false}
            className="max-h-full max-w-full rounded-lg object-contain ring-1 ring-paper/10"
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
          id="lightbox-caption"
          data-backdrop
          aria-live="polite"
          aria-atomic="true"
          className="w-full max-w-3xl shrink-0 text-center text-sm leading-6 text-paper/80"
        >
          <span className="sr-only">
            Screenshot {index + 1} of {count}:{" "}
          </span>
          {shot.caption}
        </p>
      </div>
    </div>,
    document.body
  );
}
