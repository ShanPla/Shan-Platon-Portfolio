import { useEffect, useRef, useState } from "react";
import { profile } from "../data/content.js";
import Reveal from "./Reveal.jsx";
import SectionLabel from "./SectionLabel.jsx";

// Small pills that fill with ink on hover, and then cast a signal blue
// shadow as btn-primary does. .btn gives the border, the shadow and the
// colour fade (the lift class in index.css).
const PILL = "btn btn-secondary hover:bg-ink hover:text-paper hover:shadow-signal";

// For computers with no mail app set up, where the mailto link does
// nothing: copies the address and says so for 2 seconds. The live region
// tells screen readers too.
function CopyEmail() {
  const [status, setStatus] = useState("idle");
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button type="button" onClick={copy} className={PILL}>
      <span aria-live="polite">
        {status === "copied" ? "Email copied" : status === "failed" ? "Copy failed" : "Copy email"}
      </span>
    </button>
  );
}

export default function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionLabel>04 — Contact</SectionLabel>
          <h2 className="mt-4 max-w-4xl text-balance font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">
            Looking for an OJT intern?
          </h2>
          {/* &nbsp; keeps the dash at the end of a line, never the start. */}
          <p className="mt-6 max-w-lg text-pretty leading-relaxed text-inkmuted sm:text-lg">
            I'm a final-year CS student, strongest on the frontend and learning
            backend. Reach out directly&nbsp;— I usually reply within a day.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10 sm:mt-12">
          {/* The main way to reach me: the address itself, shown as typed.
              The underline sits under the descenders, and the bottom padding
              keeps it inside the focus ring. */}
          <a
            href={`mailto:${profile.email}`}
            className="inline-block pb-2 font-display text-[clamp(1.375rem,3vw,2.125rem)] font-medium tracking-tight text-ink underline decoration-signal decoration-[3px] underline-offset-[5px] transition-colors [overflow-wrap:anywhere] [text-underline-position:under] hover:text-signaldeep hover:decoration-signaldeep"
          >
            {profile.email}
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyEmail />
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className={PILL}
            >
              GitHub / ShanPla
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className={PILL}
            >
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className={PILL}
              >
                Resume (PDF)
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
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
