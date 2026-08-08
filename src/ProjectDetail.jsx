import { Link, useParams } from "react-router-dom";
import { projects, profile } from "./data/content.js";

const ACCENTS = {
  signal: { text: "text-signal", dot: "bg-signal" },
  ok: { text: "text-ok", dot: "bg-ok" },
  amber: { text: "text-amber", dot: "bg-amber" },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-inkmuted">404</p>
        <h1 className="font-display text-2xl font-semibold text-ink">Project not found</h1>
        <Link
          to="/"
          className="mt-2 rounded-full border border-ink px-5 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const accent = ACCENTS[project.accent];

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight text-ink">
            S. Platon
          </Link>
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-wider text-inkmuted transition-colors hover:text-signal"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-inkmuted">
            {project.tag}
          </span>
          <span className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest ${accent.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
            {project.status}
          </span>
        </div>

        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {project.name}
        </h1>

        {project.image && (
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            className="mt-8 w-full rounded-xl border border-line object-cover"
          />
        )}

        <p className="mt-8 text-base leading-relaxed text-inkmuted">{project.description}</p>

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-inkmuted">
          Role: <span className="text-ink">{project.role}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-line bg-surface px-2 py-1 font-mono text-[10px] text-inkmuted"
            >
              {tech}
            </span>
          ))}
        </div>

        {/*
          TODO: Expand this page with more detail — problem/solution writeup,
          more screenshots, challenges faced, links to the live repo/demo, etc.
          All base project data comes from src/data/content.js.
        */}

        <div className="mt-14 border-t border-line pt-8">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:bg-signal"
          >
            Ask About This Project
          </a>
        </div>
      </main>
    </div>
  );
}