import { useState } from "react";
import { projects } from "../data/content.js";

const ACCENTS = {
  signal: { dot: "bg-signal", text: "text-signal", border: "hover:border-signal/50" },
  ok: { dot: "bg-ok", text: "text-ok", border: "hover:border-ok/50" },
  amber: { dot: "bg-amber", text: "text-amber", border: "hover:border-amber/50" },
};

function ProjectCard({ project }) {
  const accent = ACCENTS[project.accent];
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(project.image) && !imgError;

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-line bg-surface transition-colors ${accent.border}`}
    >
      {hasImage && (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          onError={() => setImgError(true)}
          className="h-40 w-full border-b border-line object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
            {project.tag}
          </span>
          <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${accent.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
            {project.status}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold text-ink">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-inkmuted">{project.description}</p>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-inkmuted">
          Role: <span className="text-ink">{project.role}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-line bg-paper px-2 py-1 font-mono text-[10px] text-inkmuted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">03 — Projects</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Systems I've helped build
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}