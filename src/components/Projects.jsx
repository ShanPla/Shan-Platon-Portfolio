import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/content.js";
import Reveal from "./Reveal.jsx";
import StatusBadge from "./StatusBadge.jsx";

const ACCENTS = {
  signal: {
    text: "text-signaldeep",
    border: "hover:border-signal/50",
  },
  ok: {
    text: "text-okdeep",
    border: "hover:border-ok/50",
  },
  amber: {
    text: "text-amberdeep",
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
        <div className="absolute inset-0 bg-grid bg-center opacity-50" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
            Screenshots coming soon
          </span>
        </div>
      </div>
    );
  }

  // Decorative here: the card's link names the project, and the project
  // page carries the full description of this screenshot.
  return (
    <div className={`overflow-hidden ${featured ? "h-36 sm:h-44" : "h-28"}`}>
      <img
        src={project.image}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ProjectMeta({ project }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
        {project.tag}
      </span>

      <StatusBadge status={project.status} />
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

// Its ::after layer stretches over the whole card (the article is
// relative), so clicking anywhere on the card opens the project.
function ProjectLink({ project }) {
  const accent = ACCENTS[project.accent];

  return (
    <Link
      to={`/projects/${project.id}`}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider after:absolute after:inset-0 after:rounded-xl ${accent.text}`}
    >
      <span className="underline-offset-4 group-hover:underline">View Details</span>
      <span className="sr-only normal-case">: {project.name}</span>

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
      className={`group relative overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${accent.border}`}
    >
      <ProjectImage project={project} featured />

      <div className="p-4 sm:p-5">
        <ProjectMeta project={project} />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              {project.name}
            </h3>

            <p className="mt-1 max-w-2xl text-pretty text-sm leading-5 text-inkmuted">
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
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${accent.border}`}
    >
      <ProjectImage project={project} />

      <div className="flex flex-1 flex-col p-4">
        <ProjectMeta project={project} />

        <h3 className="mt-2.5 font-display text-lg font-semibold text-ink">
          {project.name}
        </h3>

        <p className="mt-1 text-pretty text-xs leading-5 text-inkmuted">
          {project.description}
        </p>

        {/* The link gets its own row, so the pills keep the full width. */}
        <div className="mt-auto pt-3">
          <Stack project={project} />

          <div className="mt-3 flex justify-end">
            <ProjectLink project={project} />
          </div>
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
          <p className="font-mono text-xs uppercase tracking-widest text-signaldeep">
            03 — Projects
          </p>

          {/* Takes focus when a link from another page lands on #projects. */}
          <h2
            tabIndex={-1}
            className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink focus:outline-none sm:text-[28px]"
          >
            Selected work
          </h2>
        </Reveal>

        <div className="mt-6">
          <Reveal>
            <FeaturedProject project={featuredProject} />
          </Reveal>
        </div>

        {otherProjects.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {otherProjects.map((project, i) => (
              <Reveal key={project.id} delay={(i + 1) * 80} className="h-full">
                <CompactProject project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
