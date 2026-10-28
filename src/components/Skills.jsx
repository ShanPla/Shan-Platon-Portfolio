import { skills } from "../data/content.js";
import Reveal from "./Reveal.jsx";

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

              <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink sm:text-[28px]">
                Toolkit
              </h2>
            </div>

            <p className="text-xs text-inkmuted">
              Technologies I use across web, mobile, and backend.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 80}>
              <article className="overflow-hidden rounded-xl border border-line bg-paper">
                {/* Category header */}
                <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
                  <span className="font-mono text-[10px] tracking-widest text-signaldeep">
                    {group.number}
                  </span>

                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                    {group.group}
                  </h3>
                </div>

                {/* Technologies: a table of cells. The grid hangs 1px past
                    the card edge, which the card clips, so the outer cells
                    lose their right and bottom lines. */}
                <ul role="list" className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="border-b border-r border-line px-4 py-3 text-sm font-medium text-ink last:border-r-0 sm:px-5"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
