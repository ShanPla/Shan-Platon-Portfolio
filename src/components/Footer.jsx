import { profile } from "../data/content.js";

// On every page, so a visitor who lands on a project or a missing page
// still has a way to reach me. The ::after layer makes each link's tap
// area taller than its text.
const LINK =
  "relative underline decoration-line underline-offset-4 transition-colors after:absolute after:inset-x-0 after:-inset-y-3 hover:text-signaldeep hover:decoration-signaldeep";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 font-mono text-2xs text-inkmuted sm:flex-row sm:items-center sm:justify-between">
        <p className="text-pretty">
          &copy; {new Date().getFullYear()} {profile.name}. Built with React &amp; Tailwind.
        </p>

        <ul role="list" aria-label="Contact" className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={`mailto:${profile.email}`} className={LINK}>
              {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer" className={LINK}>
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={LINK}>
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
