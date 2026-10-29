import { useEffect, useRef, useState } from "react";
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

export default function Hero() {
  const spotlightRef = useRef(null);
  const frame = useRef(0);
  const reduceMotion = prefersReducedMotion();

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

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
      className="relative overflow-hidden border-b border-line"
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

      <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-14 sm:pb-12">
        {/* Identity */}
        <div
          className={
            reduceMotion ? "" : "animate-fade-up opacity-0"
          }
        >
          <div className="flex items-center gap-4">
            <Avatar />

            <div className="font-mono text-[10px] uppercase tracking-widest text-inkmuted sm:text-xs">
              <p>Software & Web</p>
              <p className="mt-1 text-signaldeep">Developer</p>
            </div>
          </div>

          {/* Name */}
          <h1
            tabIndex={-1}
            className="mt-7 whitespace-nowrap font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-ink focus:outline-none sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Shan Platon
          </h1>
        </div>

        {/* Intro */}
        <p
          className={`mt-5 max-w-2xl text-pretty text-sm leading-6 text-inkmuted sm:mt-6 sm:text-base sm:leading-7 ${
            reduceMotion ? "" : "animate-fade-up opacity-0"
          }`}
          style={reduceMotion ? undefined : { animationDelay: "100ms" }}
        >
          {/* &nbsp; keeps the dash at the end of a line, never the start. */}
          I build frontend and mobile experiences for systems that solve real
          problems&nbsp;— from responsive web interfaces to connected applications.
        </p>

        {/* Actions */}
        <div
          className={`mt-6 flex flex-wrap items-center gap-3 ${
            reduceMotion ? "" : "animate-fade-up opacity-0"
          }`}
          style={reduceMotion ? undefined : { animationDelay: "180ms" }}
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

        {/* Stats: a description list, so each value is read with its label. */}
        <dl
          className={`mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:mt-10 lg:grid-cols-4 ${
            reduceMotion ? "" : "animate-fade-up opacity-0"
          }`}
          style={reduceMotion ? undefined : { animationDelay: "260ms" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface px-2.5 py-4 sm:px-5"
            >
              <dt className="font-mono text-[9px] uppercase tracking-widest text-inkmuted sm:text-[10px]">
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
