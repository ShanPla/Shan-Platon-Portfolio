import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/content.js";
import Reveal from "./Reveal.jsx";

const ACCENTS = {
  signal: {
    dot: "bg-signal",
    text: "text-signal",
    border: "hover:border-signal/50",
  },
  ok: {
    dot: "bg-ok",
    text: "text-ok",
    border: "hover:border-ok/50",
  },
  amber: {
    dot: "bg-amber",
    text: "text-amber",
    border: "hover:border-amber/50",
  },
};

function ProjectCard({ project }) {
  const accent = ACCENTS[project.accent];
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(project.image) && !imgError;

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${accent.border}`}
    >
      {hasImage && (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          onError={() => setImgError(true)}
          className="h-40 w-full border-b border-line object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
            {project.tag}
          </span>

          <span
            className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${accent.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
            {project.status}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold text-ink">
          {project.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-inkmuted">
          {project.description}
        </p>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-inkmuted">
          Role: <span className="text-ink">{project.role}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-line bg-paper px-2 py-1 font-mono text-[10px] text-inkmuted transition-colors duration-200 group-hover:border-inkmuted/40"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className={`relative z-20 mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${accent.text} transition-opacity hover:opacity-70`}
        >
          View Details

          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            03 — Projects
          </p>

          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Systems I've helped build
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}