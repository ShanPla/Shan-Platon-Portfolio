import { Link } from "react-router-dom";

// Header for the pages other than home. Same height and style as the home
// header (Nav.jsx), so the logo stays in place when switching pages.
export default function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-[17px]">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          Shan Platon
        </Link>

        {/* restore: lands where you left the home page (ScrollToTop.jsx). */}
        <Link
          to="/#projects"
          state={{ restore: true }}
          className="relative inline-block font-mono text-xs uppercase tracking-wider text-inkmuted transition-colors after:absolute after:inset-x-0 after:-inset-y-3.5 hover:text-signaldeep"
        >
          <span aria-hidden="true">←</span> Back to Projects
        </Link>
      </div>
    </header>
  );
}
