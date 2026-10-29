import { profile } from "../data/content.js";
import Reveal from "./Reveal.jsx";

// Small pills that invert on hover. These utilities beat .btn-secondary's own
// hover colours, since Tailwind puts utilities after components.
const PILL = "btn btn-secondary hover:border-ink hover:bg-ink hover:text-paper";

export default function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signaldeep">04 — Contact</p>
          <h2 className="mt-4 max-w-4xl text-balance font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">
            Looking for an OJT intern who's ready to learn backend fast?
          </h2>
          {/* &nbsp; keeps the dash at the end of a line, never the start. */}
          <p className="mt-6 max-w-lg text-pretty leading-relaxed text-inkmuted sm:text-lg">
            I'm available for OJT. Reach out directly&nbsp;— I'll usually reply
            within a day.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10 sm:mt-12">
          {/* The main way to reach me: the address itself, shown as typed.
              The underline sits under the descenders, and the bottom padding
              keeps it inside the focus ring. */}
          <a
            href={`mailto:${profile.email}`}
            className="inline-block pb-2 font-display text-[clamp(1.375rem,3.7vw,2.75rem)] font-medium tracking-tight text-ink underline decoration-signal decoration-[3px] underline-offset-[5px] transition-colors [overflow-wrap:anywhere] [text-underline-position:under] hover:text-signaldeep hover:decoration-signaldeep"
          >
            {profile.email}
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className={PILL}
            >
              GitHub / ShanPla
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={profile.phoneHref} className={PILL}>
              {profile.phone}
            </a>
            <span className="font-mono text-xs text-inkmuted sm:ml-2">
              {profile.location}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
