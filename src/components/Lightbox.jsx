import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { srcSet } from "../imageCopies.js";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons.jsx";

const pad = (n) => String(n).padStart(2, "0");

// The picture is limited by the window's height as well as its width, so
// the full width is a safe upper bound: it never picks a copy too small.
const VIEWER_SIZES = "100vw";

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
  const swipe = useRef(null);
  const lastSwipe = useRef(0);
  const closing = useRef(false);
  // How far a swipe has moved the picture: { src, x }. After a swipe that
  // changes shot it holds the old picture in place until the next one shows.
  const [pull, setPull] = useState(null);

  const count = shots.length;
  const shot = shots[index];
  const pulled = pull?.src === shot.src;

  // The shot last asked for. A new shot reaches the address at once but
  // renders a moment later, so quick presses count on from it rather than
  // from the shot still on screen.
  const wanted = useRef(index);
  useLayoutEffect(() => {
    wanted.current = index;
    setPull(null);
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

  // Fetch the neighbouring shots so the next picture is ready. srcset and
  // sizes go on before src, so the browser fetches the same copy the
  // viewer will show.
  useEffect(() => {
    if (count < 2) return;
    for (const by of [1, -1]) {
      const next = shots[(index + by + count) % count];
      const img = new Image();
      img.sizes = VIEWER_SIZES;
      img.srcset = srcSet(next.src, next.size) ?? "";
      img.src = next.src;
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
        // Keep Tab cycling through the viewer's own buttons, skipping the
        // arrow pair this screen size hides.
        const buttons = [...dialogRef.current.querySelectorAll("button, a[href]")].filter(
          (button) => button.getClientRects().length > 0
        );
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

  // A press turns into a swipe once it moves 8px sideways (more than up or
  // down). Only then is the pointer captured, so taps on the buttons and
  // the dark area still reach them.
  function onPointerDown(e) {
    if (count < 2 || !e.isPrimary || e.button !== 0) return;
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
      // A mouse let go outside the window before it became a swipe.
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
    setPull({ src: shot.src, x: dx });
  }

  function onPointerUp(e) {
    const s = swipe.current;
    if (!s || s.id !== e.pointerId) return;
    swipe.current = null;
    if (!s.active) return;

    const dx = e.clientX - s.x;
    const from = s.moves.find((m) => e.timeStamp - m.t < 100);
    const speed = from ? (e.clientX - from.x) / Math.max(e.timeStamp - from.t, 1) : 0;
    // A quick flick changes shot however short it was, unless it flicks
    // back; a slower swipe needs 50px. Otherwise the picture settles back.
    const flick = Math.abs(speed) > 0.3 ? Math.sign(speed) : 0;
    const direction = flick || (Math.abs(dx) > 50 ? Math.sign(dx) : 0);

    lastSwipe.current = Date.now();
    if (direction !== 0 && direction === Math.sign(dx)) step(-direction);
    else setPull(null);
  }

  function onPointerCancel(e) {
    if (swipe.current?.id !== e.pointerId) return;
    swipe.current = null;
    setPull(null);
  }

  // Clicks on the dark area close the viewer, except the click a swipe ends with.
  function onClick(e) {
    if (Date.now() - lastSwipe.current < 300) return;
    if (e.target.dataset.backdrop !== undefined) close();
  }

  // Ringed so the round buttons show on the dark backdrop. From lg up the
  // arrows sit at the window's sides; on narrower screens they would cover
  // the picture's edges, so a pair under it takes over.
  const arrowClass =
    "rounded-full p-2.5 text-paper/80 ring-1 ring-inset ring-paper/15 transition-colors hover:bg-paper/15 hover:text-paper focus-visible:outline-paper";
  const sideArrowClass = `${arrowClass} absolute top-1/2 hidden -translate-y-1/2 lg:block`;

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
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className="fixed inset-0 z-50 flex select-none touch-pan-y touch-pinch-zoom flex-col bg-scrim text-paper focus:outline-none"
    >
      <div
        data-backdrop
        className="flex items-center justify-between px-4 py-3 sm:px-6 [@media(max-height:480px)]:py-1.5"
      >
        {/* Below lg the count sits with the arrows under the picture. */}
        <p
          aria-hidden="true"
          className="hidden font-mono text-2xs uppercase tracking-widest text-paper/70 lg:block"
        >
          {pad(index + 1)} / {pad(count)}
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close viewer"
          title="Close (Esc)"
          className="relative ml-auto rounded-full p-2.5 text-paper/80 transition-colors after:absolute after:-inset-1 hover:bg-paper/15 hover:text-paper focus-visible:outline-paper"
        >
          <CloseIcon />
        </button>
      </div>

      {/* The caption sits right under the picture, not at the window's foot.
          Below lg the picture gets nearly the full width, and the spacer
          centres it alone, so a longer caption doesn't move it (or the
          arrows under it) when stepping. */}
      <div
        data-backdrop
        className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 pb-4 lg:px-20 lg:pb-6 [@media(max-height:480px)]:pb-1"
      >
        <div data-backdrop className="flex-1 lg:hidden" />

        {/* From lg up the picture's row spans the full width, so the arrows
            sit at the window's sides, centred on the picture. It shrinks to
            leave room for the caption, and the picture fits inside it. */}
        <div
          data-backdrop
          className="relative flex min-h-0 items-center justify-center self-stretch lg:-mx-20 lg:px-20"
        >
          {/* Follows the finger during a swipe, and eases back if the
              swipe doesn't change shot. */}
          <img
            key={shot.src}
            src={shot.src}
            srcSet={srcSet(shot.src, shot.size)}
            sizes={VIEWER_SIZES}
            alt={shot.alt}
            draggable={false}
            style={pulled ? { transform: `translateX(${pull.x}px)` } : undefined}
            className={`max-h-full max-w-full rounded-lg object-contain ring-1 ring-paper/10 ${
              pulled ? "" : "transition-transform duration-300 ease-out"
            }`}
          />

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous screenshot"
                title="Previous (←)"
                className={`${sideArrowClass} left-5`}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next screenshot"
                title="Next (→)"
                className={`${sideArrowClass} right-5`}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Below lg the space under the caption matches the spacer above
            the picture. The row reads caption … ‹ 02 / 07 ›, as in the
            page's carousel; the caption's padding centres its first line on
            the arrows, and short screens drop it to centre the row instead. */}
        <div
          data-backdrop
          className="mt-2 w-full max-w-3xl flex-1 lg:mt-4 lg:flex-none [@media(max-height:480px)]:mt-1"
        >
          <div
            data-backdrop
            className="flex items-start gap-3 px-2 lg:px-0 [@media(max-height:480px)]:items-center"
          >
            <p
              id="lightbox-caption"
              data-backdrop
              aria-live="polite"
              aria-atomic="true"
              className="min-w-0 flex-1 py-2.5 text-sm leading-6 text-paper/80 lg:py-0 lg:text-center [@media(max-height:480px)]:py-0"
            >
              <span className="sr-only">
                Screenshot {index + 1} of {count}:{" "}
              </span>
              {shot.caption}
            </p>

            {count > 1 && (
              <div className="flex shrink-0 items-center gap-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous screenshot"
                  title="Previous (←)"
                  className={arrowClass}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>

                <span
                  aria-hidden="true"
                  className="min-w-[3.5rem] text-center font-mono text-2xs uppercase tracking-widest text-paper/70"
                >
                  {pad(index + 1)} / {pad(count)}
                </span>

                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next screenshot"
                  title="Next (→)"
                  className={arrowClass}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
