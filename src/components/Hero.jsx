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
      className="h-24 w-24 shrink-0 rounded-full border-2 border-line object-cover shadow-sm sm:h-28 sm:w-28"
    />
  ) : (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-line bg-surface font-display text-xl font-semibold text-inkmuted sm:h-28 sm:w-28 sm:text-2xl">
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
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_70%)]" />

      {!reduceMotion && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(420px circle at ${spotlight.x}% ${spotlight.y}%, rgba(47,111,237,0.13), transparent 70%)`,
          }}
        />
      )}

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          {profile.availability}
        </div>

        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <Avatar />
          <div>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-3 font-mono text-sm uppercase tracking-wider text-signal sm:text-base">
              {profile.role}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-inkmuted sm:text-lg">
          {profile.tagline}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:bg-signal"
          >
            View Projects
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
          >
            Get In Touch
          </a>
        </div>

        {/* Signature element: system-status readout strip */}
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-sm font-medium text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}