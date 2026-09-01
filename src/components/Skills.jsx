import { skills } from "../data/content.js";
import Reveal from "./Reveal.jsx";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            02 — Skills
          </p>

          <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink sm:text-[28px]">
            Toolkit
          </h2>

          <p className="mt-2.5 max-w-2xl text-sm leading-5 text-inkmuted">
            A practical stack I use to design interfaces, build applications,
            and connect them to real data and services.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 100}>
              <article className="group h-full overflow-hidden rounded-xl border border-line bg-paper transition-colors duration-300 hover:border-signal/40">
                {/* Category header */}
                <div className="flex items-start gap-3 border-b border-line px-4 py-4 sm:px-5">
                  <span className="pt-0.5 font-mono text-[10px] tracking-widest text-signal">
                    {group.number}
                  </span>

                  <div>
                    <h3 className="font-display text-base font-semibold uppercase tracking-wide text-ink">
                      {group.group}
                    </h3>

                    <p className="mt-1 max-w-md text-xs leading-5 text-inkmuted">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="divide-y divide-line">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="grid gap-0.5 px-4 py-3 transition-colors duration-200 hover:bg-surface sm:grid-cols-[minmax(110px,0.7fr)_1.3fr] sm:items-center sm:gap-4 sm:px-5"
                    >
                      <p className="text-sm font-medium text-ink">
                        {item.name}
                      </p>

                      <p className="text-[11px] leading-4 text-inkmuted sm:text-xs">
                        {item.detail}
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