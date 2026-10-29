import { useState } from "react";
import { Link } from "react-router-dom";
import { profile, projects } from "../data/content.js";
import { srcSet } from "../imageCopies.js";
import Reveal from "./Reveal.jsx";
import SectionLabel from "./SectionLabel.jsx";
import StatusBadge from "./StatusBadge.jsx";

// Each project's own accent: its number, and its View project pill while
// the row is hovered. The deep shades keep small text readable.
const ACCENTS = {
  signal: {
    number: "text-signaldeep",
    pill: "group-hover:border-signaldeep group-hover:bg-signaldeep",
  },
  ok: {
    number: "text-okdeep",
    pill: "group-hover:border-okdeep group-hover:bg-okdeep",
  },
  amber: {
    number: "text-amberdeep",
    pill: "group-hover:border-amberdeep group-hover:bg-amberdeep",
  },
};

// Two digits, so the first project is 01.
const pad = (n) => String(n).padStart(2, "0");

// The screenshot on a framed plate, which lifts with the row's hover (or
// its link's keyboard focus) and presses in with it (lift-with-group in
// index.css). Decorative here: the row's link names the project, and the
// project page carries the full description of it.
function Plate({ project }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(project.image) && !imgError;

  return (
    <div className="lift-with-group rounded-2xl bg-surface p-2.5">
      {hasImage ? (
        <img
          src={project.image}
          srcSet={srcSet(project.image, project.shotSize)}
          // The plate's inside: the wide column from 1024px, else the page
          // width less its padding and the plate's border and padding.
          sizes="(min-width: 1024px) 515px, calc(100vw - 70px)"
          alt=""
          width={project.shotSize?.width}
          height={project.shotSize?.height}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className="block h-auto w-full rounded-md border border-line"
        />
      ) : (
        // Wider below 1024px, where nothing sits beside it to match.
        <div className="relative flex aspect-[5/2] items-center justify-center overflow-hidden rounded-md border border-line bg-paper lg:aspect-[2/1]">
          <div className="absolute inset-0 bg-grid bg-center opacity-50" />

          <span className="relative font-mono text-3xs uppercase tracking-widest text-inkmuted">
            Screenshots coming soon
          </span>
        </div>
      )}
    </div>
  );
}

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

// The row's one link. Its ::after layer stretches over the whole row (the
// article is relative) and above the plate, which moves as it lifts, so
// clicking anywhere on the row opens the project.
function ProjectLink({ project, accent }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink px-4 py-2 font-mono text-2xs uppercase tracking-wider text-ink transition-colors after:absolute after:inset-0 after:z-10 group-hover:text-paper ${accent.pill}`}
    >
      View project
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

// One project: the plate beside its text, swapping sides on every other
// row from 1024px; below that, the plate sits above the text.
function ProjectRow({ project, index }) {
  const accent = ACCENTS[project.accent] ?? ACCENTS.signal;
  const flip = index % 2 === 1;

  return (
    <article
      className={`group relative grid items-center gap-7 lg:gap-14 ${
        flip
          ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          : "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      }`}
    >
      <div className={flip ? "lg:order-last" : ""}>
        <Plate project={project} />
      </div>

      <div>
        <p className="font-mono text-2xs uppercase tracking-widest text-inkmuted">
          <span aria-hidden="true">
            <span className={accent.number}>{pad(index + 1)}</span> /{" "}
          </span>
          {[project.year, project.tag].filter(Boolean).join(" · ")}
        </p>

        <h3 className="mt-3 font-display text-[32px] font-semibold leading-[1.1] tracking-tight text-ink lg:text-[40px]">
          {project.name}
        </h3>

        <p className="mt-3 max-w-xl text-pretty text-[15px] leading-6 text-inkmuted">
          {project.description}
        </p>

        <div className="mt-4">
          <StatusBadge status={project.status} />
        </div>

        <div className="mt-4">
          <Stack project={project} />
        </div>

        <div className="mt-6">
          <ProjectLink project={project} accent={accent} />
        </div>
      </div>
    </article>
  );
}

// Closes the list. Dark, so it reads as the way out rather than one more
// project; its shadow is signal blue, as an ink one would vanish into it.
function GitHubTile() {
  return (
    <a
      href={profile.github}
      target="_blank"
      rel="noreferrer"
      className="lift group/tile flex flex-col gap-2 rounded-2xl bg-ink px-6 py-7 text-paper shadow-signal hover:shadow-signal active:shadow-signal sm:flex-row sm:items-center sm:justify-between sm:px-8"
    >
      <span className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">
        More on GitHub
      </span>

      <span className="font-mono text-xs text-paper/75">
        {profile.github.replace(/^https?:\/\//, "")}{" "}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5"
        >
          ↗
        </span>
      </span>

      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <SectionLabel>03 — Projects</SectionLabel>

          {/* Takes focus when a link from another page lands on #projects. */}
          <h2
            tabIndex={-1}
            className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink focus:outline-none sm:text-[28px]"
          >
            Selected work
          </h2>
        </Reveal>

        <div className="mt-8 space-y-16 lg:space-y-20">
          {projects.map((project, index) => (
            <Reveal key={project.id}>
              <ProjectRow project={project} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 lg:mt-20">
          <GitHubTile />
        </Reveal>
      </div>
    </section>
  );
}
