import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { projects } from "./data/content.js";
import { srcSet } from "./imageCopies.js";
import NotFound from "./NotFound.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Lightbox from "./components/Lightbox.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Reveal from "./components/Reveal.jsx";
import ScreenshotCarousel from "./components/ScreenshotCarousel.jsx";
import SectionLabel from "./components/SectionLabel.jsx";
import SkipLink from "./components/SkipLink.jsx";
import StatusBadge from "./components/StatusBadge.jsx";

// role="list" because Safari drops list semantics once list styles are removed.
function Stack({ project }) {
  return (
    <ul role="list" className="flex flex-wrap gap-1.5">
      {project.stack.map((tech) => (
        <li
          key={tech}
          className="rounded border border-line bg-surface px-2.5 py-1.5 font-mono text-3xs text-inkmuted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

// Opens the shot in the screenshot viewer. `size` ({ width, height })
// reserves its space before it loads. `sizes` is the width it shows at, so
// the browser picks the smallest copy that is still sharp; the default is
// the full column, inside the 1px border.
function ShotButton({
  shot,
  size,
  sizes = "(min-width: 1024px) 974px, calc(100vw - 50px)",
  onOpen,
  eager = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      <img
        src={shot.src}
        srcSet={srcSet(shot.src, size)}
        sizes={sizes}
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
          {/* Sized for the phone shots' grid: two columns, four from 640px. */}
          <ShotButton
            shot={shot}
            size={size}
            sizes="(min-width: 1024px) 233px, (min-width: 640px) calc(25vw - 23px), calc(50vw - 32px)"
            onOpen={() => onOpen(index)}
          />

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
        <p className="font-mono text-3xs uppercase tracking-widest text-inkmuted">
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
    <ol role="list" className="divide-y divide-line border-b border-line">
      {contribution.map((item, index) => (
        <li
          key={item.title}
          className="grid gap-2 py-4 first:pt-1 sm:grid-cols-[32px_150px_1fr]"
        >
          <span aria-hidden="true" className="font-mono text-3xs text-inkmuted">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="text-sm font-medium text-ink">
            {item.title}
          </h3>

          <p className="text-pretty text-sm leading-5 text-inkmuted">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

function FeatureList({ project }) {
  const features = project.features ?? [];

  if (features.length === 0) return null;

  return (
    <ol role="list" className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {features.map((feature, index) => (
        <li
          key={feature}
          className="flex items-start gap-3"
        >
          <span aria-hidden="true" className="font-mono text-3xs text-inkmuted">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="text-pretty text-sm text-ink">{feature}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  // The open screenshot is in the address (?shot=3), so browser Back
  // closes the viewer and a shared link opens that shot.
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const project = projects.find((item) => item.id === id);

  useEffect(() => {
    if (project) document.title = `${project.name} — Shan Platon`;
  }, [project]);

  if (!project) return <NotFound title="Project not found" />;

  // The project's place in the list, counted from 1 (02 / 03 in the
  // breadcrumb). The next project follows it; the last leads to the first.
  const position = projects.indexOf(project) + 1;
  const nextProject = projects[position % projects.length];
  const screenshots = project.screenshots ?? [];
  const phoneScreenshots = project.phoneScreenshots ?? [];

  // Every screenshot on the page in page order, so the viewer's arrows
  // run from the Overview shot through the carousel to the phone shots.
  // Each carries its pixel size, so the viewer can list its smaller copies.
  const overviewShot = project.image && {
    src: project.image,
    alt: project.imageAlt ?? `${project.name} screenshot`,
    caption: project.imageCaption,
  };
  const viewerShots = [
    overviewShot && { ...overviewShot, size: project.shotSize },
    ...screenshots.map((shot) => ({ ...shot, size: project.shotSize })),
    ...phoneScreenshots.map((shot) => ({ ...shot, size: project.phoneShotSize })),
  ].filter(Boolean);
  const firstScreenshot = overviewShot ? 1 : 0;
  const firstPhoneShot = firstScreenshot + screenshots.length;

  // ?shot counts from 1; a value that isn't a shot here (?shot=abc,
  // ?shot=99) opens nothing.
  const shotNumber = Number(searchParams.get("shot"));
  const viewerIndex =
    Number.isInteger(shotNumber) && shotNumber >= 1 && shotNumber <= viewerShots.length
      ? shotNumber - 1
      : null;

  // Opening adds a history entry and stepping replaces it, so one Back
  // closes the viewer. The hash is kept, or ScrollToTop would move the page.
  const showShot = (index, options) =>
    navigate({ search: `?shot=${index + 1}`, hash: location.hash }, options);
  const openViewer = (index) => showShot(index, { state: { viewer: true } });
  const stepViewer = (index) => showShot(index, { replace: true, state: location.state });
  // Close goes Back to the entry the viewer was opened from. A shared
  // ?shot= link has no such entry (and no state, even after stepping), so
  // it drops the shot in place.
  const closeViewer = () =>
    location.state?.viewer
      ? navigate(-1)
      : navigate({ search: "", hash: location.hash }, { replace: true });

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
      <SkipLink />
      <PageHeader />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-5xl px-6 py-12 focus:outline-none sm:py-16"
      >

        {/* Header */}
        <Reveal>
          {/* Breadcrumb. Projects lands where you left the list, like Back
              to Projects; screen readers hear the count as project 2 of 3. */}
          <p className="font-mono text-3xs uppercase tracking-widest text-inkmuted">
            <Link
              to="/#projects"
              state={{ restore: true }}
              className="relative inline-block underline decoration-inkmuted/50 underline-offset-4 transition-colors after:absolute after:inset-x-0 after:-inset-y-3.5 hover:text-signaldeep hover:decoration-signaldeep"
            >
              Projects
            </Link>
            <span aria-hidden="true">
              {" · "}
              {String(position).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="sr-only normal-case">
              {" "}
              project {position} of {projects.length}
            </span>
          </p>

          <section className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-3xs uppercase tracking-widest text-inkmuted">
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
                  <dt className="font-mono text-3xs uppercase tracking-widest text-inkmuted">
                    Role
                  </dt>

                  <dd className="mt-2 text-sm text-ink">
                    {project.role}
                  </dd>

                  {project.team && (
                    <>
                      <dt className="mt-4 font-mono text-3xs uppercase tracking-widest text-inkmuted">
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
                      <a href={project.live} target="_blank" rel="noreferrer" className="btn btn-secondary">
                        Live site
                        <span className="sr-only normal-case">
                          : {project.name} (opens in a new tab)
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
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

        {/* Overview. This section and the ones below open on their label,
            whose rule divides them from the section before. */}
        {showOverview && (
          <Reveal delay={150} loadStagger>
            <section className="mt-16">
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
            <section className="mt-16">
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
            <section className="mt-16">
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
          <section className="mt-16">
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
          <div className="mt-14 border-t border-line pt-6">
            <Link
              to="/#projects"
              state={{ restore: true }}
              className="relative inline-block font-mono text-3xs uppercase tracking-widest text-inkmuted transition-colors after:absolute after:inset-x-0 after:-inset-y-3.5 hover:text-signaldeep"
            >
              <span aria-hidden="true">←</span> Back to Projects
            </Link>

            {/* The next project as a full-width band; hover and keyboard
                focus turn it blue. */}
            {nextProject !== project && (
              <Link
                to={`/projects/${nextProject.id}`}
                className="group mt-6 flex items-center justify-between gap-6 rounded-2xl bg-ink px-6 py-8 text-paper transition-colors hover:bg-signaldeep focus-visible:bg-signaldeep sm:px-10 sm:py-12"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-3xs uppercase tracking-widest text-paper/80">
                    Next project
                  </span>{" "}
                  <span className="mt-2 block text-balance font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                    {nextProject.name}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-3xl transition-transform duration-200 group-hover:translate-x-1.5 sm:text-5xl"
                >
                  →
                </span>
              </Link>
            )}
          </div>
        </Reveal>

      </main>

      <BackToTop />

      {viewerIndex !== null && (
        <Lightbox
          shots={viewerShots}
          index={viewerIndex}
          label={`${project.name} screenshots`}
          onIndexChange={stepViewer}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}
