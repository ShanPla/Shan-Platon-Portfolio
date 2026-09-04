import { skills } from "../data/content.js";
import Reveal from "./Reveal.jsx";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signal">
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
              <article className="group overflow-hidden rounded-xl border border-line bg-paper transition-colors duration-300 hover:border-signal/40">
                {/* Category header */}
                <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
                  <span className="font-mono text-[10px] tracking-widest text-signal">
                    {group.number}
                  </span>

                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                    {group.group}
                  </h3>
                </div>

                {/* Technologies */}
                <div className="grid grid-cols-2 divide-x divide-line sm:grid-cols-3">
                  {group.items.map((item, index) => (
                    <div
                      key={item.name}
                      className={`px-4 py-3 transition-colors duration-200 hover:bg-surface sm:px-5 ${
                        index >= group.items.length - (group.items.length % 2)
                          ? ""
                          : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-ink">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}