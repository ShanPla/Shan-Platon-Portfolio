import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projects } from "./data/content.js";
import Lightbox from "./components/Lightbox.jsx";
import Reveal from "./components/Reveal.jsx";
import ScreenshotCarousel from "./components/ScreenshotCarousel.jsx";

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

// Opens the shot in the screenshot viewer.
function ShotButton({ shot, onOpen, eager = false, className = "" }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      <img
        src={shot.src}
        alt={shot.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
      />
      <span className="sr-only">Open larger view</span>
    </button>
  );
}

function ScreenshotGrid({ shots, onOpen, className = "" }) {
  return (
    <div className={`grid gap-x-3 gap-y-5 ${className}`}>
      {shots.map((shot, index) => (
        <figure key={shot.src}>
          <ShotButton shot={shot} onOpen={() => onOpen(index)} />

          <figcaption className="mt-2 text-xs leading-5 text-inkmuted">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ScreenshotPlaceholder() {
  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative flex min-h-56 items-center justify-center px-6">
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

function ContributionList({ project }) {
  const contribution = project.contribution ?? [];

  if (contribution.length === 0) return null;

  return (
    <div className="mt-4 divide-y divide-line border-y border-line">
      {contribution.map((item, index) => (
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
  const features = project.features ?? [];

  if (features.length === 0) return null;

  return (
    <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {features.map((feature, index) => (
        <div
          key={feature}
          className="flex items-start gap-3"
        >
          <span className="font-mono text-[10px] text-inkmuted">
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
  // The open screenshot, tied to its project so the viewer closes if the
  // page switches to another project.
  const [viewer, setViewer] = useState(null);

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

  const accent = ACCENTS[project.accent] ?? ACCENTS.signal;
  const screenshots = project.screenshots ?? [];
  const phoneScreenshots = project.phoneScreenshots ?? [];

  // Every screenshot on the page in page order, so the viewer's arrows
  // run from the Overview shot through the carousel to the phone shots.
  const overviewShot = project.image && {
    src: project.image,
    alt: project.imageAlt ?? `${project.name} screenshot`,
    caption: project.imageCaption,
  };
  const viewerShots = [overviewShot, ...screenshots, ...phoneScreenshots].filter(Boolean);
  const firstScreenshot = overviewShot ? 1 : 0;
  const firstPhoneShot = firstScreenshot + screenshots.length;

  const viewerIndex = viewer?.projectId === project.id ? viewer.index : null;
  const openViewer = (index) => setViewer({ projectId: project.id, index });

  // Number only the sections this project shows, so labels never skip.
  const sections = [
    "Overview",
    project.contribution?.length > 0 && "My Contribution",
    project.features?.length > 0 && "Key Features",
    "Selected Screens",
  ].filter(Boolean);

  const label = (name) =>
    `${String(sections.indexOf(name) + 1).padStart(2, "0")} — ${name}`;

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
        <Reveal>
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-inkmuted">
                {project.tag}
              </span>

              <span
                className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${accent.text}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${accent.dot} ${
                    project.status === "IN PROGRESS" ? "animate-pulse" : ""
                  }`}
                />

                {project.status}
              </span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_260px] lg:items-end">
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

                <p className="mt-2 text-sm text-ink">
                  {project.role}
                </p>

                <div className="mt-4">
                  <Stack project={project} />
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Overview */}
        <Reveal delay={150}>
          <section className="mt-14 border-t border-line pt-8">
            <SectionLabel>{label("Overview")}</SectionLabel>

            <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                What is {project.name}?
              </h2>

              <p className="max-w-2xl text-sm leading-6 text-inkmuted">
                {project.overview ?? project.description}
              </p>
            </div>

            {overviewShot && (
              <ShotButton
                shot={overviewShot}
                eager
                onOpen={() => openViewer(0)}
                className="mt-6"
              />
            )}
          </section>
        </Reveal>

        {/* Contribution */}
        {project.contribution?.length > 0 && (
          <Reveal delay={200}>
            <section className="mt-14 border-t border-line pt-8">
              <SectionLabel>{label("My Contribution")}</SectionLabel>

              <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  What I worked on
                </h2>

                <ContributionList project={project} />
              </div>
            </section>
          </Reveal>
        )}

        {/* Features */}
        {project.features?.length > 0 && (
          <Reveal delay={250}>
            <section className="mt-14 border-t border-line pt-8">
              <SectionLabel>{label("Key Features")}</SectionLabel>

              <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  Project scope
                </h2>

                <FeatureList project={project} />
              </div>
            </section>
          </Reveal>
        )}

        {/* Screenshots */}
        <Reveal delay={300}>
          <section className="mt-14 border-t border-line pt-8">
            <SectionLabel>{label("Selected Screens")}</SectionLabel>

            {screenshots.length > 0 ? (
              <ScreenshotCarousel
                key={project.id}
                shots={screenshots}
                label={`${project.name} screenshots`}
                onOpen={(index) => openViewer(firstScreenshot + index)}
                className="mt-4"
              />
            ) : (
              <ScreenshotPlaceholder />
            )}

            {phoneScreenshots.length > 0 && (
              <ScreenshotGrid
                shots={phoneScreenshots}
                onOpen={(index) => openViewer(firstPhoneShot + index)}
                className="mt-8 grid-cols-2 sm:grid-cols-4"
              />
            )}
          </section>
        </Reveal>

        {/* Footer */}
        <Reveal delay={350}>
          <section className="mt-14 border-t border-line pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                  Project
                </p>

                <p className="mt-2 text-sm text-ink">
                  {project.name}
                </p>
              </div>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-all duration-200 ${accent.border} hover:-translate-y-0.5 hover:text-signal`}
                >
                  GitHub
                  <span>↗</span>
                </a>
              )}
            </div>
          </section>
        </Reveal>

        {/* Navigation */}
        <Reveal delay={400}>
          <div className="mt-10 border-t border-line pt-6">
            <Link
              to="/#projects"
              className="font-mono text-[10px] uppercase tracking-widest text-inkmuted transition-colors hover:text-signal"
            >
              ← Back to Projects
            </Link>
          </div>
        </Reveal>

      </main>

      {viewerIndex !== null && (
        <Lightbox
          shots={viewerShots}
          index={viewerIndex}
          onIndexChange={openViewer}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}