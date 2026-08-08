import { profile } from "../data/content.js";
import Reveal from "./Reveal.jsx";

export default function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">04 — Contact</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">
            Looking for an OJT intern who's ready to learn backend fast.
          </h2>
          <p className="mt-4 max-w-lg text-inkmuted leading-relaxed">
            Reach out directly — I'll usually reply within a day.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:bg-signal"
          >
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
          >
            GitHub / ShanPla
          </a>
        </Reveal>

        <div className="mt-6 font-mono text-xs text-inkmuted">
          {profile.phone} &middot; {profile.location}
        </div>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-6 font-mono text-[11px] text-inkmuted">
          &copy; {new Date().getFullYear()} {profile.name}. Built with React &amp; Tailwind.
        </div>
      </footer>
    </section>
  );
}