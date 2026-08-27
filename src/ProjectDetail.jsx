import { Link, useParams } from "react-router-dom";
import { projects } from "./data/content.js";

const ACCENTS = {
  signal: {
    text: "text-signal",
    dot: "bg-signal",
    border: "hover:border-signal/50",
  },
  ok: {
    text: "text-ok",
    dot: "bg-ok",
    border: "hover:border-ok/50",
  },
  amber: {
    text: "text-amber",
    dot: "bg-amber",
    border: "hover:border-amber/50",
  },
};

function SectionLabel({ children }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
      {children}
    </p>
  );
}

function ProjectImage({ project }) {
  const [primaryImage, ...additionalImages] = project.screenshots ?? [];

  if (!primaryImage) {
    return (
      <div className="relative mt-8 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="relative flex min-h-64 items-center justify-center px-6">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-inkmuted">
              Project Screenshots
            </p>

            <p className="mt-2 max-w-sm text-xs text-inkmuted">
              Screenshots can be added later from the project's content data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
        <img
          src={primaryImage}
          alt={`${project.name} project screenshot`}
          className="block w-full object-cover"
        />
      </div>

      {additionalImages.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {additionalImages.map((image, index) => (
            <div
              key={image}
              className="overflow-hidden rounded-xl border border-line bg-surface"
            >
              <img
                src={image}
                alt={`${project.name} screenshot ${index + 2}`}
                className="block aspect-[16/10] w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Stack({ project }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.stack.map((tech) => (
        <span
          key={tech}
          className="rounded border border-line bg-surface px-2.5 py-1.5 font-mono text-[10px] text-inkmuted"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function ContributionList({ project }) {
  return (
    <div className="mt-5 divide-y divide-line border-y border-line">
      {project.contribution.map((item, index) => (
        <div
          key={item.title}
          className="grid gap-2 py-4 sm:grid-cols-[32px_150px_1fr]"
        >
          <span className="font-mono text-[10px] text-inkmuted">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="text-sm font-medium text-ink">
            {item.title}
          </h3>

          <p className="text-sm leading-5 text-inkmuted">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function FeatureList({ project }) {
  return (
    <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {project.features.map((feature, index) => (
        <div key={feature} className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-[10px] text-inkmuted">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="text-sm text-ink">{feature}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();

  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          404
        </p>

        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
          Project not found
        </h1>

        <Link
          to="/#projects"
          className="mt-6 rounded-full border border-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const accent = ACCENTS[project.accent];

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            Shan Platon
          </Link>

          <Link
            to="/#projects"
            className="font-mono text-[10px] uppercase tracking-widest text-inkmuted transition-colors hover:text-signal"
          >
            ← Back to Projects
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Header */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-inkmuted">
              {project.tag}
            </span>

            <span
              className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${accent.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
              {project.status}
            </span>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {project.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-inkmuted">
                {project.description}
              </p>
            </div>

            <div className="lg:border-l lg:border-line lg:pl-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                Role
              </p>

              <p className="mt-2 text-sm text-ink">{project.role}</p>

              <div className="mt-4">
                <Stack project={project} />
              </div>
            </div>
          </div>
        </section>

        {/* Main project visual */}
        <ProjectImage project={project} />

        {/* Overview */}
        <section className="mt-14 border-t border-line pt-8">
          <SectionLabel>01 — Overview</SectionLabel>

          <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              What is {project.name}?
            </h2>

            <p className="max-w-2xl text-sm leading-6 text-inkmuted">
              {project.overview}
            </p>
          </div>
        </section>

        {/* Contribution */}
        <section className="mt-14 border-t border-line pt-8">
          <SectionLabel>02 — My Contribution</SectionLabel>

          <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              What I worked on
            </h2>

            <ContributionList project={project} />
          </div>
        </section>

        {/* Features */}
        <section className="mt-14 border-t border-line pt-8">
          <SectionLabel>03 — Key Features</SectionLabel>

          <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              Project scope
            </h2>

            <FeatureList project={project} />
          </div>
        </section>

        {/* Screenshots */}
        {project.screenshots?.length > 0 && (
          <section className="mt-14 border-t border-line pt-8">
            <SectionLabel>04 — Selected Screens</SectionLabel>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.screenshots.map((image, index) => (
                <div
                  key={image}
                  className="overflow-hidden rounded-xl border border-line bg-surface"
                >
                  <img
                    src={image}
                    alt={`${project.name} screen ${index + 1}`}
                    className="block aspect-[16/10] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <section className="mt-14 border-t border-line pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                Project Repository
              </p>

              <p className="mt-2 text-sm text-ink">
                {project.githubLabel}
              </p>
            </div>

            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors ${accent.border} hover:text-signal`}
            >
              GitHub
              <span>↗</span>
            </a>
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-10 border-t border-line pt-6">
          <Link
            to="/#projects"
            className="font-mono text-[10px] uppercase tracking-widest text-inkmuted transition-colors hover:text-signal"
          >
            ← Back to Projects
          </Link>
        </div>
      </main>
    </div>
  );
}