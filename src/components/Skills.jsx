import { skills } from "../data/content.js";
import { logos } from "../data/logos.js";
import Reveal from "./Reveal.jsx";

// A tool's mark on a small tile, in the text colour. Decorative: the chip's
// text names the tool. The negative margin tucks the tile into the chip's
// corner, so a chip without a logo keeps even padding.
function Logo({ name }) {
  const logo = logos[name];
  if (!logo) return null;

  return (
    <span className="-ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-paper transition-colors duration-200 group-hover:bg-signal/10 group-hover:text-signaldeep">
      <svg viewBox={logo.viewBox} fill="currentColor" aria-hidden="true" className="h-[18px] w-[18px]">
        <path d={logo.path} />
      </svg>
    </span>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signaldeep">
                02 — Skills
              </p>

              <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
                Toolkit
              </h2>
            </div>

            <p className="text-xs text-inkmuted">
              Technologies I use across web, mobile, and backend.
            </p>
          </div>
        </Reveal>

        {/* One row per group: its label on the left (above on phones), its
            tools as chips on the right, hairlines between the rows. */}
        <div className="mt-6 divide-y divide-line border-t border-line">
          {skills.map((group, i) => (
            <Reveal
              key={group.group}
              delay={i * 80}
              className="grid gap-3 py-5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6"
            >
              {/* As tall as a chip, so the label lines up with the first row. */}
              <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-inkmuted sm:h-10">
                <span aria-hidden="true" className="text-signaldeep">
                  {group.number}
                </span>
                {group.group}
              </h3>

              {/* role="list" because Safari drops list semantics once list
                  styles are removed. aria-label names the list after its
                  group, in its own case (Chrome would read the heading's in
                  capitals). Chips aren't links, so no hard shadow: hover only
                  lifts and tints them. */}
              <ul role="list" aria-label={group.group} className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="group flex h-10 items-center gap-2.5 rounded-lg border border-line px-3.5 text-sm font-medium text-ink transition duration-200 hover:border-signal hover:bg-signal/5 motion-safe:hover:-translate-y-0.5"
                  >
                    <Logo name={item.logo} />
                    {item.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
