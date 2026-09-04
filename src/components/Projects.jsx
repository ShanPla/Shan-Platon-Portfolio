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
          featured ? "h-36 sm:h-44" : "h-28"
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
    <div className={`overflow-hidden ${featured ? "h-36 sm:h-44" : "h-28"}`}>
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
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${accent.text} transition-opacity hover:opacity-70`}
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

      <div className="p-4 sm:p-5">
        <ProjectMeta project={project} />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              {project.name}
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-5 text-inkmuted">
              {project.description}
            </p>

            <div className="mt-2.5">
              <Stack project={project} />
            </div>
          </div>

          <ProjectLink project={project} />
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

      <div className="p-4">
        <ProjectMeta project={project} />

        <div className="mt-2.5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-ink">
              {project.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-inkmuted">
              {project.description}
            </p>
          </div>

          <ProjectLink project={project} />
        </div>

        <div className="mt-3">
          <Stack project={project} />
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
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signal">
                03 — Projects
              </p>

              <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
                Projects
              </h2>
            </div>

            <p className="hidden text-xs text-inkmuted sm:block">
              Selected work
            </p>
          </div>
        </Reveal>

        <div className="mt-6">
          <Reveal>
            <FeaturedProject project={featuredProject} />
          </Reveal>
        </div>

        {otherProjects.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {otherProjects.map((project, i) => (
              <Reveal key={project.id} delay={(i + 1) * 80}>
                <CompactProject project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}