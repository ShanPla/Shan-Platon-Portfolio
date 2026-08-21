import { skills } from "../data/content.js";
import Reveal from "./Reveal.jsx";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            02 — Skills
          </p>

          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Toolkit
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-inkmuted sm:text-base">
            A practical stack I use to design interfaces, build applications,
            and connect them to real data and services.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 100}>
              <article className="group h-full overflow-hidden rounded-xl border border-line bg-paper transition-colors duration-300 hover:border-signal/40">
                {/* Category header */}
                <div className="flex items-start gap-4 border-b border-line px-5 py-5 sm:px-6">
                  <span className="pt-0.5 font-mono text-xs tracking-widest text-signal">
                    {group.number}
                  </span>

                  <div>
                    <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                      {group.group}
                    </h3>

                    <p className="mt-1.5 max-w-md text-sm leading-5 text-inkmuted">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="divide-y divide-line">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="grid gap-1 px-5 py-4 transition-colors duration-200 hover:bg-surface sm:grid-cols-[minmax(120px,0.7fr)_1.3fr] sm:items-center sm:gap-5 sm:px-6"
                    >
                      <p className="font-medium text-ink">
                        {item.name}
                      </p>

                      <p className="text-xs leading-5 text-inkmuted sm:text-sm">
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