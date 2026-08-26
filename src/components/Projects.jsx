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

function ProjectImage({ project, featured = false }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(project.image) && !imgError;

  if (!hasImage) {
    return (
      <div
        className={`relative overflow-hidden bg-surface ${
          featured ? "h-52 sm:h-64" : "h-40"
        }`}
      >
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
            Project Preview
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${featured ? "h-52 sm:h-64" : "h-40"}`}>
      <img
        src={project.image}
        alt={`${project.name} screenshot`}
        onError={() => setImgError(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ProjectMeta({ project }) {
  const accent = ACCENTS[project.accent];

  return (
    <div className="flex items-center justify-between gap-4">
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
  );
}

function Stack({ project }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.stack.map((tech) => (
        <span
          key={tech}
          className="rounded border border-line bg-paper px-2 py-1 font-mono text-[10px] text-inkmuted"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function ProjectLink({ project }) {
  const accent = ACCENTS[project.accent];

  return (
    <Link
      to={`/projects/${project.id}`}
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${accent.text} transition-opacity hover:opacity-70`}
    >
      View Details

      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

function FeaturedProject({ project }) {
  const accent = ACCENTS[project.accent];

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accent.border}`}
    >
      <ProjectImage project={project} featured />

      <div className="p-5 sm:p-6">
        <ProjectMeta project={project} />

        <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
              {project.name}
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-inkmuted">
              {project.description}
            </p>

            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-inkmuted">
              Role: <span className="text-ink">{project.role}</span>
            </p>

            <div className="mt-3">
              <Stack project={project} />
            </div>
          </div>

          <div className="sm:pb-1">
            <ProjectLink project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactProject({ project }) {
  const accent = ACCENTS[project.accent];

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${accent.border}`}
    >
      <ProjectImage project={project} />

      <div className="p-5">
        <ProjectMeta project={project} />

        <h3 className="mt-3 font-display text-lg font-semibold text-ink">
          {project.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-inkmuted">
          {project.description}
        </p>

        <div className="mt-4">
          <Stack project={project} />
        </div>

        <div className="mt-4">
          <ProjectLink project={project} />
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
        <Reveal>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signal">
                03 — Projects
              </p>

              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Projects
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-5 text-inkmuted sm:text-right">
              A few projects I've built and contributed to.
            </p>
          </div>
        </Reveal>

        <div className="mt-8">
          <Reveal>
            <FeaturedProject project={featuredProject} />
          </Reveal>
        </div>

        {otherProjects.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {otherProjects.map((project, i) => (
              <Reveal key={project.id} delay={(i + 1) * 100}>
                <CompactProject project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}