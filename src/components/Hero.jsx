import { useCallback, useRef, useState } from "react";
import { profile, stats } from "../data/content.js";

const initials = profile.name
  .split(" ")
  .map((part) => part[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

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
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-base font-semibold text-inkmuted sm:h-20 sm:w-20 sm:text-lg">
      {initials}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 0 });
  const reduceMotion = prefersReducedMotion();

  const handleMouseMove = useCallback(
    (e) => {
      if (reduceMotion || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      setSpotlight({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [reduceMotion]
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden border-b border-line"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_0%,#000_10%,transparent_75%)]" />

      {/* Subtle spotlight */}
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, rgba(47,111,237,0.10), transparent 70%)`,
          }}
        />
      )}

      <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-14 sm:pb-12 sm:pt-18">
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
              <p className="mt-1 text-signal">Developer</p>
            </div>
          </div>

          {/* Name */}
          <h1 className="mt-7 whitespace-nowrap font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            Shan Platon
          </h1>
        </div>

        {/* Intro */}
        <p
          className={`mt-5 max-w-2xl text-sm leading-6 text-inkmuted sm:mt-6 sm:text-base sm:leading-7 ${
            reduceMotion ? "" : "animate-fade-up opacity-0"
          }`}
          style={reduceMotion ? undefined : { animationDelay: "100ms" }}
        >
          I build frontend and mobile experiences for systems that solve real
          problems — from responsive web interfaces to connected applications.
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
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-paper transition-colors hover:bg-signal"
          >
            View My Work
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-surface px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
          >
            GitHub
          </a>

          {profile.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-inkmuted transition-colors hover:border-ink hover:text-ink"
            >
              Resume
            </a>
          )}
        </div>

        {/* Stats */}
        <div
          className={`mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:mt-10 sm:grid-cols-4 ${
            reduceMotion ? "" : "animate-fade-up opacity-0"
          }`}
          style={reduceMotion ? undefined : { animationDelay: "260ms" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface px-4 py-4 transition-colors hover:bg-paper sm:px-5"
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-inkmuted sm:text-[10px]">
                {stat.label}
              </p>

              <p className="mt-1.5 text-xs font-medium text-ink sm:text-sm">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}