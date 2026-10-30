import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile, stats } from "../data/content.js";

// First and last name, so "Shan Christian M. Platon" gives "SP". Stray
// spaces are ignored, and a one-word name gives one letter.
const nameParts = profile.name.trim().split(/\s+/);
const initials = (
  nameParts[0][0] + (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")
).toUpperCase();

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The intro plays the first time the hero shows in a page load; coming back
// from a project page shows it at rest.
let introPlayed = false;

// When each piece of the intro starts, in seconds (the motion is in
// index.css). Each line of the headline starts LINE_STAGGER after the one
// above; a fourth line on narrow phones rises with the third.
const DELAY = { label: 0, name: 0.1, portrait: 0.2, headline: 0.22, subline: 0.42, actions: 0.5, tiles: 0.6 };
const LINE_STAGGER = 0.12;

// One mask per word, so the headline can rise line by line however it
// wraps; Hero gives each word the delay of its line. The space after each
// word sits inside its mask, so copied text keeps it. end: the headline's
// last words, so no space after the final one.
function Words({ text, end = false }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span key={i} className="hero-mask">
      <span>{end && i === words.length - 1 ? word : `${word} `}</span>
    </span>
  ));
}

function Avatar() {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(profile.image) && !imgError;

  return hasImage ? (
    <img
      src={profile.image}
      alt={profile.name}
      onError={() => setImgError(true)}
      className="h-16 w-16 shrink-0 rounded-full border border-line object-cover sm:h-20 sm:w-20"
    />
  ) : (
    <div
      aria-hidden="true"
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-base font-semibold text-inkmuted sm:h-20 sm:w-20 sm:text-lg"
    >
      {initials}
    </div>
  );
}

// The photo in a frame like the project screenshots', beside the text from
// 1024px (the round Avatar stands in below that). Until profile.image is
// set, the frame shows the initials on the hero's grid.
function Portrait() {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(profile.image) && !imgError;

  return (
    <div className="rounded-2xl border border-ink bg-surface p-2.5 shadow-[3px_3px_0_0] shadow-ink">
      {hasImage ? (
        <img
          src={profile.image}
          alt={profile.name}
          onError={() => setImgError(true)}
          className="block aspect-[4/5] w-full rounded-md border border-line object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-md border border-line bg-paper"
        >
          <div className="absolute inset-0 bg-grid bg-center opacity-50" />
          <span className="relative font-display text-6xl font-semibold tracking-tight text-inkmuted">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const spotlightRef = useRef(null);
  const headlineRef = useRef(null);
  const frame = useRef(0);
  const reduceMotion = prefersReducedMotion();
  const [intro] = useState(() => !introPlayed && !reduceMotion);
  const delay = (seconds) => (intro ? { animationDelay: `${seconds}s` } : undefined);

  useEffect(() => {
    introPlayed = true;
    return () => cancelAnimationFrame(frame.current);
  }, []);

  // Gives each headline word the delay of the line it sits on.
  useLayoutEffect(() => {
    if (!intro) return;
    const masks = [...headlineRef.current.querySelectorAll(".hero-mask")];
    const stagger = () => {
      const tops = [...new Set(masks.map((mask) => mask.offsetTop))];
      for (const mask of masks) {
        const line = Math.min(tops.indexOf(mask.offsetTop), 2);
        mask.firstChild.style.animationDelay = `${DELAY.headline + line * LINE_STAGGER}s`;
      }
    };
    stagger();

    // On a first visit the web font can arrive after this and rewrap the
    // headline; place the words again if they have not started rising.
    const start = performance.now();
    document.fonts?.ready.then(() => {
      if (performance.now() - start < DELAY.headline * 1000) stagger();
    });
  }, [intro]);

  // Moves the glow through CSS variables, at most once per frame, instead
  // of re-rendering the hero on every mouse move.
  function moveSpotlight(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      spotlightRef.current?.style.setProperty("--spot-x", `${x}%`);
      spotlightRef.current?.style.setProperty("--spot-y", `${y}%`);
    });
  }

  // Back to the resting spot instead of staying where the mouse left.
  function resetSpotlight() {
    cancelAnimationFrame(frame.current);
    spotlightRef.current?.style.removeProperty("--spot-x");
    spotlightRef.current?.style.removeProperty("--spot-y");
  }

  return (
    <section
      id="top"
      onMouseMove={reduceMotion ? undefined : moveSpotlight}
      onMouseLeave={reduceMotion ? undefined : resetSpotlight}
      className={`relative overflow-hidden border-b border-line ${intro ? "hero-intro" : ""}`}
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_0%,#000_10%,transparent_75%)]" />

      {/* Subtle spotlight */}
      {!reduceMotion && (
        <div
          ref={spotlightRef}
          className="hero-spotlight pointer-events-none absolute inset-0"
        />
      )}

      <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-12 sm:pb-14 sm:pt-16">
        {/* From 1024px the text and the photo sit side by side. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
          <div>
            {/* Identity. The round avatar is for phones and tablets; from
                1024px the photo frame beside the text takes its place. */}
            <div className="hero-fade flex items-center gap-4" style={delay(DELAY.label)}>
              <div className="lg:hidden">
                <Avatar />
              </div>

              <div className="font-mono text-3xs uppercase tracking-widest text-inkmuted sm:text-xs">
                <p>Software & Web</p>
                <p className="mt-1 text-signaldeep">Developer</p>
              </div>
            </div>

            {/* Name: the largest type on the page, 48px on phones up to 112px,
                and always one line. */}
            <h1
              tabIndex={-1}
              className="mt-8 whitespace-nowrap font-display text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink focus:outline-none sm:mt-10"
            >
              <span className="hero-mask">
                <span style={delay(DELAY.name)}>Shan Platon</span>
              </span>
            </h1>

            {/* Headline, with what I build in bold ink. Screen readers get it
                once as plain text and skip the masked words, on which
                VoiceOver would stop one word at a time. */}
            <p
              ref={headlineRef}
              className="mt-6 max-w-[26ch] text-balance font-display text-[clamp(1.375rem,3vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-inkmuted sm:mt-8"
            >
              <span className="sr-only">
                I build frontend and mobile experiences for systems that solve
                real problems.
              </span>
              <span aria-hidden="true">
                <Words text="I build" />
                <strong className="font-bold text-ink">
                  <Words text="frontend and mobile experiences" />
                </strong>
                <Words text="for systems that solve real problems." end />
              </span>
            </p>

            <p
              className="hero-fade mt-4 max-w-xl text-pretty text-sm leading-6 text-inkmuted sm:text-base sm:leading-7"
              style={delay(DELAY.subline)}
            >
              From responsive web interfaces to connected applications.
            </p>

            {/* Actions */}
            <div
              className="hero-fade mt-8 flex flex-wrap items-center gap-3"
              style={delay(DELAY.actions)}
            >
              <a
                href="#projects"
                className="btn btn-primary"
              >
                View My Work
              </a>

              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>

              {profile.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Resume
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>

          {/* Photo: 220px wide at 1024px, growing to 280px. */}
          <div
            className="hero-fade hidden w-[clamp(220px,22vw,280px)] lg:block"
            style={delay(DELAY.portrait)}
          >
            <Portrait />
          </div>
        </div>

        {/* Stats: a description list, so each value is read with its label. */}
        <dl
          className="hero-fade mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:mt-12 lg:grid-cols-4"
          style={delay(DELAY.tiles)}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface px-2.5 py-4 sm:px-5"
            >
              <dt className="font-mono text-3xs uppercase tracking-widest text-inkmuted">
                {stat.label}
              </dt>

              <dd className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink sm:text-sm">
                {stat.available && (
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
                )}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
