import { about } from "../data/content.js";
import Reveal from "./Reveal.jsx";
import SectionLabel from "./SectionLabel.jsx";

export default function About() {
  return (
    <section id="about" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <SectionLabel>01 — About</SectionLabel>

          <h2 className="mt-1.5 max-w-2xl font-display text-xl font-semibold leading-tight tracking-tight text-ink sm:text-2xl">
            {about.heading}
          </h2>

          <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-inkmuted">
            {about.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
