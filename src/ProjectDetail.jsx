import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projects } from "./data/content.js";
import NotFound from "./NotFound.jsx";
import Lightbox from "./components/Lightbox.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Reveal from "./components/Reveal.jsx";
import ScreenshotCarousel from "./components/ScreenshotCarousel.jsx";
import StatusBadge from "./components/StatusBadge.jsx";

// The Live site and GitHub links under the stack.
const LINK_PILL =
  "inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors duration-200 hover:border-signal hover:text-signaldeep";

function SectionLabel({ as: Tag = "p", children, ...props }) {
  return (
    <Tag
      {...props}
      className="font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-signaldeep"
    >
      {children}
    </Tag>
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

// Opens the shot in the screenshot viewer. `size` ({ width, height })
// reserves its space before it loads.
function ShotButton({ shot, size, onOpen, eager = false, className = "" }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      <img
        src={shot.src}
        alt={shot.alt}
        width={size?.width}
        height={size?.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
      />
      <span className="sr-only">Open larger view</span>
    </button>
  );
}

function ScreenshotGrid({ shots, size, onOpen, className = "" }) {
  return (
    <div className={`grid gap-x-3 gap-y-5 ${className}`}>
      {shots.map((shot, index) => (
        <figure key={shot.src}>
          <ShotButton shot={shot} size={size} onOpen={() => onOpen(index)} />

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
      <div className="absolute inset-0 bg-grid bg-center opacity-50" />

      <div className="relative flex min-h-56 items-center justify-center px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-inkmuted">
          Screenshots coming soon
        </p>
      </div>
    </div>
  );
}

function ContributionList({ project }) {
  const contribution = project.contribution ?? [];

  if (contribution.length === 0) return null;

  return (
    <div className="divide-y divide-line border-b border-line">
      {contribution.map((item, index) => (
        <div
          key={item.title}
          className="grid gap-2 py-4 first:pt-1 sm:grid-cols-[32px_150px_1fr]"
        >
          <span className="font-mono text-[10px] text-inkmuted">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="text-sm font-medium text-ink">
            {item.title}
          </h3>

          <p className="text-pretty text-sm leading-5 text-inkmuted">
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
    <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {features.map((feature, index) => (
        <div
          key={feature}
          className="flex items-start gap-3"
        >
          <span className="font-mono text-[10px] text-inkmuted">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="text-pretty text-sm text-ink">{feature}</span>
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

  useEffect(() => {
    if (project) document.title = `${project.name} — Shan Platon`;
  }, [project]);

  if (!project) return <NotFound title="Project not found" />;

  // The next project in the list; the last one leads back to the first.
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
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

  // Overview needs its own text or the main shot; otherwise it would only
  // repeat the description under the title.
  const showOverview = Boolean(project.overview || overviewShot);

  // Number only the sections this project shows, so labels never skip.
  const sections = [
    showOverview && "Overview",
    project.contribution?.length > 0 && "My Contribution",
    project.features?.length > 0 && "Key Features",
    "Selected Screens",
  ].filter(Boolean);

  const label = (name) =>
    `${String(sections.indexOf(name) + 1).padStart(2, "0")} — ${name}`;

  return (
    <div className="min-h-screen bg-paper">
      <PageHeader />

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">

        {/* Header */}
        <Reveal>
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                {project.tag}
              </span>

              <StatusBadge status={project.status} />
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
              <div>
                <h1
                  tabIndex={-1}
                  className="font-display text-4xl font-semibold tracking-tight text-ink focus:outline-none sm:text-5xl"
                >
                  {project.name}
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-inkmuted">
                  {project.description}
                </p>
              </div>

              <div className="lg:border-l lg:border-line lg:pl-6">
                <dl>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                    Role
                  </dt>

                  <dd className="mt-2 text-sm text-ink">
                    {project.role}
                  </dd>

                  {project.team && (
                    <>
                      <dt className="mt-4 font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                        Team
                      </dt>

                      <dd className="mt-2 text-sm text-ink">
                        {project.team}
                      </dd>
                    </>
                  )}
                </dl>

                <div className="mt-4">
                  <Stack project={project} />
                </div>

                {(project.live || project.github) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className={LINK_PILL}>
                        Live site
                        <span className="sr-only normal-case">
                          : {project.name} (opens in a new tab)
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className={LINK_PILL}>
                        GitHub
                        <span className="sr-only normal-case">
                          : {project.name} repository (opens in a new tab)
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}

                {project.access && (
                  <p className="mt-3 text-pretty text-xs leading-5 text-inkmuted">
                    {project.access}
                  </p>
                )}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Overview */}
        {showOverview && (
          <Reveal delay={150} loadStagger>
            <section className="mt-14 border-t border-line pt-8">
              <SectionLabel>{label("Overview")}</SectionLabel>

              <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  What is {project.name}?
                </h2>

                {project.overview && (
                  <p className="max-w-2xl text-pretty text-sm leading-6 text-inkmuted">
                    {project.overview}
                  </p>
                )}
              </div>

              {overviewShot && (
                <ShotButton
                  shot={overviewShot}
                  size={project.shotSize}
                  eager
                  onOpen={() => openViewer(0)}
                  className="mt-6"
                />
              )}
            </section>
          </Reveal>
        )}

        {/* Contribution */}
        {project.contribution?.length > 0 && (
          <Reveal delay={200} loadStagger>
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
          <Reveal delay={250} loadStagger>
            <section className="mt-14 border-t border-line pt-8">
              <SectionLabel>{label("Key Features")}</SectionLabel>

              <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  What it does
                </h2>

                <FeatureList project={project} />
              </div>
            </section>
          </Reveal>
        )}

        {/* Screenshots */}
        <Reveal delay={300} loadStagger>
          <section className="mt-14 border-t border-line pt-8">
            {/* The label doubles as this section's heading; aria-label keeps
                the number and the capitals out of its spoken name. */}
            <SectionLabel as="h2" aria-label="Selected screens">
              {label("Selected Screens")}
            </SectionLabel>

            {screenshots.length > 0 ? (
              <ScreenshotCarousel
                key={project.id}
                shots={screenshots}
                size={project.shotSize}
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
                size={project.phoneShotSize}
                onOpen={(index) => openViewer(firstPhoneShot + index)}
                className="mt-8 grid-cols-2 sm:grid-cols-4"
              />
            )}
          </section>
        </Reveal>

        {/* Navigation */}
        <Reveal delay={350} loadStagger>
          <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6">
            <Link
              to="/#projects"
              state={{ restore: true }}
              className="relative inline-block font-mono text-[10px] uppercase tracking-widest text-inkmuted transition-colors after:absolute after:inset-x-0 after:-inset-y-3.5 hover:text-signaldeep"
            >
              <span aria-hidden="true">←</span> Back to Projects
            </Link>

            {nextProject !== project && (
              <Link to={`/projects/${nextProject.id}`} className="group text-right">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-inkmuted">
                  Next project
                </span>{" "}
                <span className="mt-1 block text-sm font-medium text-ink transition-colors group-hover:text-signaldeep">
                  {nextProject.name} <span aria-hidden="true">→</span>
                </span>
              </Link>
            )}
          </div>
        </Reveal>

      </main>

      {viewerIndex !== null && (
        <Lightbox
          shots={viewerShots}
          index={viewerIndex}
          label={`${project.name} screenshots`}
          onIndexChange={openViewer}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}
