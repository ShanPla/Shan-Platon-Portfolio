import { Link } from "react-router-dom";
import useScrolledPast from "../useScrolledPast.js";

// Header for the pages other than home. Same height and style as the home
// header (Nav.jsx), so the logo stays in place when switching pages; its
// rule shows once the page moves, as there.
export default function PageHeader() {
  const scrolled = useScrolledPast(8);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-paper/85 backdrop-blur transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-line shadow-md shadow-ink/5" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-[17px]">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          Shan Platon
        </Link>

        {/* restore: lands where you left the home page (ScrollToTop.jsx).
            Same underline as the home header's links. */}
        <Link
          to="/#projects"
          state={{ restore: true }}
          className="relative inline-block font-mono text-xs uppercase tracking-wider text-inkmuted transition-colors before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:origin-right before:scale-x-0 before:bg-signal before:transition-transform before:duration-[350ms] before:ease-out after:absolute after:inset-x-0 after:-inset-y-3.5 hover:text-signaldeep hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100"
        >
          <span aria-hidden="true">←</span> Back to Projects
        </Link>
      </nav>
    </header>
  );
}
