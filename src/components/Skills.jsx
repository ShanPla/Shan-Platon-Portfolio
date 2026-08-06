import { skills } from "../data/content.js";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">02 — Skills</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Toolkit
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.group}>
              <h3 className="font-mono text-xs uppercase tracking-wider text-inkmuted">
                {group.group}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
